<?php
namespace app\api\controller;
use think\Controller;
use think\Request;
use think\Validate;
use think\Db;

class Response extends Controller {
  protected $validater; // 用来校验数据/参数
  protected $params; // 通过校验的参数
  protected $request; // 用来处理参数
  protected $userInfo; // 当前登录用户的用户信息
  protected $rules = array(
    'Cat' => array(
      'addcat' => array(
        ['catname', ['/^[a-zA-Z\x{4e00}-\x{9fa5}\d]{2,50}$/u', 'unique:cat'], '栏目名必须是2-50位的汉字、英文、数字！|该栏目名已存在'],
        'token' => 'token'
      ),
      'editcat' => array(
        ['catname', ['/^[a-zA-Z\x{4e00}-\x{9fa5}\d]{2,50}$/u'], '栏目名必须是2-50位的汉字、英文、数字！'],
        ['cat_id', 'require', '栏目id不能为空'],
        'token' => 'token'
      ),
      'deletecat' => array(
        ['cat_id', 'require', '栏目id不能为空'],
        'token' => 'token'
      )
    ),
    'Art' => array(
      'addart' => array(
        ['title', ['/^[a-zA-Z\x{4e00}-\x{9fa5}\d\_\-]{2,50}$/u', 'unique:art'], '栏目名必须是2-50位的汉字、英文、数字、横杠！|该文章名已存在'],
        'cat_id'  => 'require',
        'content' => 'require',
        'file' => 'require',
        'remarks' => 'require',
        'token' => 'token'
      ),
      'editart' => array(
        ['title', ['/^[a-zA-Z\x{4e00}-\x{9fa5}\d\_\-]{2,50}$/u', 'unique:art'], '栏目名必须是2-50位的汉字、英文、数字、横杠！|该文章名已存在'],
        'cat_id'  => 'require',
        'remarks' => 'require',
        'content' => 'require',
        'token' => 'token'
      ),
      'getartdetails' => array(
        'art_id'  => 'require'
      ),
      'getart' => array(
        'curPage'  => 'require|number',
        'pageSize' => 'require|number'
      ),
      'readnum' => array(
        'art_id'   => 'require'
      )
    ),
    'Comment' => array(
      'addcomment' => array(
        'art_id'  => 'require',
        'content' => 'require',
        'token' => 'token'
      )
    ),
    'User' => array(
      'login' => array(
        ['name', ['require', 'chsAlphaNum', 'length:3,11'], '请输入用户名或手机号！|用户名或手机号错误！|用户名或手机号错误！'],
        ['password', ['require', '/^([a-zA-Z\d]){6,18}$/'], '请输入密码！|密码输入错误！']
      ),
      'register' => array(
        ['name', ['require', 'chsAlpha', 'length:3,10', 'unique:user'], '用户名不能为空！|用户名必须是汉字或者英文！|用户名长度3到10位！|该用户名已存在！'],
        ['mobile', ['require', '/^1[3|4|5|7|8]\d{9}/', 'unique:user'], '请输入手机号码！|请输入正确的手机号码！|该手机号已注册！'],
        ['code', 'require', '请输入验证码！'],
        ['password', ['require', 'length:6,18', '/^([a-zA-Z\d]){6,18}$/'], '请输入密码！|密码长度6到18位！|密码必须是数字或者字母！']
      ),
      'sms' => array(
        ['mobile', ['require', '/^1[3|4|5|7|8]\d{9}$/'], '请输入手机号码！|请输入正确的手机号码！']
      ),
      'editpwd' => array(
        ['password', ['require', 'length:6,18', '/^([a-zA-Z\d]){6,18}$/'], '请输入新密码！|密码长度6到18位！|密码必须是数字或者字母！'],
        'token' => 'token'
      ),
      'retrievePwd' => array(
        ['mobile', ['require', '/^1[3|4|5|7|8]\d{9}$/'], '请输入手机号码！|请输入正确的手机号码！'],
        ['code', 'require', '请输入验证码！'],
        ['password', ['require', 'length:6,18', '/^([a-zA-Z\d]){6,18}$/'], '请输入新密码！|密码长度6到18位！|密码必须是数字或者字母！']
      )
    )
  );

  public function _initialize() {
    parent::_initialize();
    header("Access-Control-Allow-Origin: *");
    $this->request = Request::instance();
    // $this->checkTime($this->request->only(['time']));
    $this->checkParams($this->request->param());
  }

  /**
   * 判断时间戳
   * @param $arr 带有时间戳的数组
   */
  public function checkTime($arr) {
    if (!isset($arr['time']) || intval($arr['time']) <= 1) {
      $this->json(400, '时间戳不存在！');
    }
    if (time() - intval($arr['time']) > 60 || time() - intval($arr['time']) < 0) {
      $this->json(400, '请求超时！');
    }
  }

  /**
   * 验证参数 参数过滤
   * @param $arr 请求的参数
   */
  public function checkParams($arr) {
    /**************** 有规则才验证 ******************/
    if (isset($this->rules[$this->request->controller()]) && isset($this->rules[$this->request->controller()][$this->request->action()])) {
      /**************** 获取验证规则 ******************/
      $rules = $this->rules[$this->request->controller()][$this->request->action()];
      /**************** 如果有值证明该接口需要校验token ******************/
      if (isset($rules['token'])) {
        $token = $this->request->header('token');
        if (empty($token)) {
          $this->json(501, '缺少用户令牌！');
        }
        $this->checkToken($token);
      }
      /**************** 验证不通过返回错误 ******************/
      // var_dump($this->request->header('token'));
      $this->validater = new Validate($rules);
      if (!$this->validater->check($arr)) {
        $this->json(502, $this->validater->getError());
      }
    }
    /**************** 通过验证 ******************/
    $this->params = $arr;
  }
  /**
   * 验证token是否有效
   * @param string $token 请求数据携带的token
   */
  public function checkToken($token) {
    $res = Db::table('user')->where('token', 'eq', $token)->find();
    /************** 错误的token ************/
    if (!is_array($res)) {
      $this->json(501, '无效的用户令牌！');
    }
    $this->userInfo = $res;
    $curTime = time();
    /************** token有效时间七天 ************/
    if ($curTime - $res['lastlogin'] > 3600 * 24 * 7) {
      $this->json(501, '用户令牌已过期！');
    }
  }

  /**
  * 按综合方式输出通信数据
  * @param integer $code 状态码
  * @param string $message 提示信息
  * @param array $data 数据
  * @param string $type 数据类型
  * return string
  */
  public function show($code, $message = '', $data = array(), $type = self::JSON) {
    if(!is_numeric($code)) {
      return '';
    }

    $type = isset($_GET['format']) ? $_GET['format'] : self::JSON;

    $result = array(
      'code' => $code,
      'message' => $message,
      'data' => $data,
    );

    if($type == 'json') {
      self::json($code, $message, $data);
      exit;
    } elseif($type == 'array') {
      var_dump($result);
    } elseif($type == 'xml') {
      self::xmlEncode($code, $message, $data);
      exit;
    } else {
      // TODO
    }
  }
  /**
  * 按json方式输出通信数据
  * @param integer $code 状态码
  * @param string $message 提示信息
  * @param array $data 数据
  * return string
  */
  public function json($code, $message = '', $data = array()) {  
    if(!is_numeric($code)) {
      return '';
    }

    $result = array(
      'code' => $code,
      'message' => $message,
      'data' => $data
    );

    echo json_encode($result, JSON_UNESCAPED_UNICODE);
    exit;
  }

  /**
  * 按xml方式输出通信数据
  * @param integer $code 状态码
  * @param string $message 提示信息
  * @param array $data 数据
  * @return string
  */
  public function xmlEncode($code, $message, $data = array()) {
    if(!is_numeric($code)) {
      return '';
    }

    $result = array(
      'code' => $code,
      'message' => $message,
      'data' => $data,
    );

    header("Content-Type:text/xml");
    $xml = "<?xml version='1.0' encoding='UTF-8'?>\n";
    $xml .= "<root>\n";

    $xml .= self::xmlToEncode($result);

    $xml .= "</root>";
    echo $xml;
  }

  public function xmlToEncode($data) {
    $xml = $attr = "";
    foreach($data as $key => $value) {
      if(is_numeric($key)) {
        $attr = " id='{$key}'";
        $key = "item";
      }
      $xml .= "<{$key}{$attr}>";
      $xml .= is_array($value) ? self::xmlToEncode($value) : $value;
      $xml .= "</{$key}>\n";
    }
    return $xml;
  }

  /**
   * 生成一个随机字符串
   * @param number $length 长度，默认长度为9
   * @return string $str 生成之后的随机字符串
   */
  public function randomStr($length=9){
    $arr = array_merge(range(0,9), range('A','Z'));
    $str = '';
    $arr_len = count($arr);
    for($i = 0;$i < $length;$i++){
      $rand = mt_rand(0, $arr_len-1);
      $str.=$arr[$rand];
    }
    return $str;
  }
}