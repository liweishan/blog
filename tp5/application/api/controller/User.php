<?php
  namespace app\api\controller;
  use think\Db;
  use think\Cache;
  class User extends Response
  {
    public function login() {
      $data = $this->params;
      $name = $data['name'];
      $res = Db::table('user')->where("name='{$name}' OR mobile='{$name}'")->find();
      if (!is_array($res)) {
        $this->json(400, '该用户名或手机号不存在！');
      }
      
      $pwd = $this->getPwd($data['password'], $res['salt']);
      if ($pwd !== $res['password']) {
        $this->json(400, '用户密码错误！');
      }
      $data['lastlogin'] = time();
      $token = $this->getToken($data, $res['salt']);
      $upData = array(
        'token'     => $token,
        'lastlogin' => $data['lastlogin'],
        'user_id'   => $res['user_id']
      );
      $res2 = Db::table('user')->update($upData);
      if ($res2) {
        $this->json(200, '', ['token' => $token, 'name' => $res['name']]);
      } else {
        $this->json(400, '登录失败！');
      }
    }

    public function register() {
      $data = $this->params;
      // 判断该手机号是否有cookie
      $codes = Cache::get($data['mobile']);
      if (!$codes) {
        $this->json(500, '请确认是否发送验证码！');
      }
      if ($data['code'] != $codes['code']) {
        $this->json(500, '验证码输入错误！');
      }
      // 用当前时间减去存入cookie时的时间，大于等于180S过期
      if (time() - $codes['time'] >= 180) {
        $this->json(500, '验证码已过期！');
      }
      $data['salt'] = $this->randomStr();
      $data['password'] = $this->getPwd($data['password'], $data['salt']);
      $res = Db::table('user')->insert($data);
      if ($res) {
        // 成功之后清除cookie
        Cache::set($data['mobile'], NULL);
        $this->json(200, '用户注册成功!');
      } else {
        $this->json(500, '用户注册失败！');
      }
    }

    public function sms() {
      $data = $this->params;
      $code = mt_rand(1000, 9999);
      $res = $this->getSmsInfo($data['mobile'], $code);
      if ($res['code'] === 0) {
        // 把验证码存入cookie
        Cache::set($data['mobile'], array(
          'time' => time(),
          'code' => $code
        ), 10 * 60);
        $this->json(200, '');
      } else {
        $this->json(500, '短信发送失败！', array());
      }
    }

    public function editPwd() {
      $data = $this->params;
      $userInfo = $this->userInfo;
      $arr['password'] = $this->getPwd($data['password'], $userInfo['salt']);
      if ($arr['password'] === $userInfo['password']) {
        $this->json(500, '新密码不能与旧密码相同');
      }

      $res = Db::table('user')->where('token', 'eq', $userInfo['token'])->update($arr);
      if ($res) {
        $this->json(200, '');
      } else {
        $this->json(500, '密码修改失败！');
      }
    }

    public function retrievePwd() {
      $data = $this->params;
      $res = Db::table('user')->where('mobile', 'eq', $data['mobile'])->find();
      if (!is_array($res)) {
        $this->json(500, '该手机号不存在用户！');
      }
      $codes = Cache::get($data['mobile']);
      // 判断该手机号是否有cookie
      if (!$codes) {
        $this->json(500, '请确认是否发送验证码！');
      }
      if ($data['code'] != $codes['code']) {
        $this->json(500, '验证码输入错误！');
      }
      // 用当前时间减去存入cookie时的时间，大于等于180S过期
      if (time() - $codes['time'] >= 180) {
        $this->json(500, '验证码已过期！');
      }
      $arr['password'] = $this->getPwd($data['password'], $res['salt']);
      // 新密码与旧密码相同
      if ($arr['password'] === $res['password']) {
        $this->json(200, '');
      }
      $res = Db::table('user')->where('mobile', 'eq', $data['mobile'])->update($arr);
      if ($res) {
        $this->json(200, '');
      } else {
        $this->json(500, '密码修改失败！');
      }
    }

    /**
     * 发送短信获取第三方返回的信息
     * @param string $mobile 给谁发,手机号填写多条请用逗号隔开
     * @return array $array 返回第三方发送短信的信息
     */
    public function getSmsInfo($mobile, $code) {
      header('Content-Type:text/html;charset=utf-8');
      $apikey = 'ace6a3267b52ac07e5a074f378fa5558'; // 修改为您的apikey(https://www.yunpian.com)登录官网后获取
      $text = '【李维珊】您的验证码是'.$code.'。如非本人操作请忽略';
      $ch = curl_init();
      // print_r($ch);
      /* 设置验证方式 */
      curl_setopt($ch, CURLOPT_HTTPHEADER, array('Accept:text/plain;charset=utf-8', 'Content-Type:application/x-www-form-urlencoded','charset=utf-8'));
      /* 设置返回结果为流 */
      curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
      /* 设置超时时间*/
      curl_setopt($ch, CURLOPT_TIMEOUT, 10);
      /* 设置通信方式 */
      curl_setopt($ch, CURLOPT_POST, 1);
      curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false);
      // 取得用户信息
      $json_data = $this->get_user($ch, $apikey);
      $array = json_decode($json_data, true);
      // 发送短信
      $data = array('text'=> $text,'apikey'=> $apikey,'mobile'=> $mobile);
      $json_data = $this->send($ch, $data);
      $array = json_decode($json_data, true);
      return($array);
    }

    /**
     * 获取短信账号
     * @param array $ch cur资源
     * @param string $apikey 云片网的apikey
     */
    function get_user($ch, $apikey){
      curl_setopt($ch, CURLOPT_URL, 'https://sms.yunpian.com/v2/user/get.json');
      curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query(array('apikey' => $apikey)));
      return curl_exec($ch);
    }

    /**
     * 获取短信模板
     * @param array $ch cur资源
     * @param array $data 发送短信的参数
     */
    function send($ch, $data){
      curl_setopt ($ch, CURLOPT_URL, 'https://sms.yunpian.com/v2/sms/single_send.json');
      curl_setopt($ch, CURLOPT_POSTFIELDS, http_build_query($data));
      return curl_exec($ch);
    }
     /**
     * 获取加密之后的密码
     * @param string $pwd 真正的密码
     * @param string $salt 盐
     * @return string $str 加密之后的字符串
     */
    public function getPwd($pwd, $salt) {
      return $str = md5(md5($pwd.$salt).$salt);
    }

    /**
     * 获取token
     * @param array $data 用户信息
     * @return string $token 返回使用md5加密之后的字符串
     */
    public function getToken($data, $salt) {
      return $token = md5(md5($data['name'].$data['password'].$data['lastlogin']).$salt);
    }
  }