<?php
namespace app\api\controller;
use think\Db;
class Art extends Response
{
  public function getArt() {
    $data = $this->params;
    // 判断是否有cat_id
    $curPage = $data['curPage'];
    $pageSize = $data['pageSize'];
    if (!isset($data['cat_id'])) {
      $res = Db::table('art')->limit(($curPage - 1) * $pageSize, $pageSize)->order('art_id desc')->select();
      $total = Db::table('art')->count();
    } else {
      $cat_id = $data['cat_id'];
      $res = Db::table('art')->where('cat_id', 'eq', $cat_id)->order('art_id desc')->limit(($curPage - 1) * $pageSize, $pageSize)->where('cat_id', 'eq', $cat_id)->select();
      $total = Db::table('art')->where('cat_id', 'eq', $data['cat_id'])->count();
    }
    if (is_array($res)) {
      $data = array(
        'result' => $res,
        'total'  => $total
      );
      $this->json(200, '', $data);
    } else {
      $this->json(500, '数据查询失败！');
    }
  }

  public function getArtAll() {
    $data = $this->params;
    // 判断是否有cat_id
    if (!isset($data['cat_id'])) {
      $res = Db::table('art')->select();
      $total = Db::table('art')->count();
    } else {
      $res = Db::table('art')->where('cat_id', 'eq', $data['cat_id'])->order('art_id desc')->select();
      $total = Db::table('art')->where('cat_id', 'eq', $data['cat_id'])->count();
    }

    if (is_array($res)) {
      $data = array(
        'result' => $res,
        'total'  => $total
      );
      $this->json(200, '', $data);
    } else {
      $this->json(500, '数据查询失败！');
    }
  }
  
  public function getArtDetails() {
    $data = $this->params;
    $art_id = $data['art_id'];
    $arr = array();
    $res = Db::table('art')->find($art_id);
    $prve = Db::table('art')->field('art_id,title')->where('art_id', '>', $data['art_id'])->order('art_id', 'asc')->find();
    $next = Db::table('art')->field('art_id,title')->where('art_id', '<', $data['art_id'])->order('art_id', 'desc')->find();
    if ($res) {
      $arr['info'] = $res;
      $arr['prve'] = $prve;
      $arr['next'] = $next;
      $this->json(200, '', $arr);
    } else {
      $this->json(500, '数据查询失败！');
    }
  }

  public function addArt() {
    $data = $this->params;
    $data['pubtime'] = time();
    $file = $this->uploadFile('file');
    if ($file) {
      $data['pic'] = $file['pic'];
      $data['suo'] = $file['suo'];
    } else {
      $this->json(500, $file);
    }
    $row = Db::table('cat')->find($data['cat_id']);
    if (!$row) {
      $this->json(500, '栏目不存在！');
    }
    $data['catname'] = $row['catname'];
    $res = Db::table('art')->insert($data);
    if ($res) {
      $artId = Db::table('art')->getLastInsID();
      $row = Db::table('art')->find($artId);
      // 文章添加成功给cat的文章数加1
      Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->setInc('num');
      $this->json(200, '文章添加成功！', $row);
    } else {
      $this->json(500, '文章添加失败！');
    }
  }

  public function editArt() {
    $data = $this->params;
    $art = Db::table('art')->where('art_id', 'eq', $data['art_id'])->find();
    // 如果修改了栏目，那么就要修改对应栏目的文章数
    if ($art['cat_id'] !== $data['cat_id']) {
      $cat = Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->find();
      $data['catname'] = $cat['catname'];
      Db::table('cat')->where('cat_id', 'eq', $art['cat_id'])->setDec('num');
      Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->setInc('num');
    }
    $data['lastup'] = time();
    $file = $this->uploadFile('file');
    // 如果修改了图片那么就要删除之前的图片
    if ($file) {
      @unlink(ROOT_PATH . 'public' . DS . $art['pic']);
      @unlink(ROOT_PATH . 'public' . DS . $art['suo']);
      $data['pic'] = $file['pic'];
      $data['suo'] = $file['suo'];
    }
    $res = Db::table('art')->where('art_id', 'eq', $data['art_id'])->update($data);
    if ($res) {
      $this->json(200, '文章编辑成功！');
    } else {
      $this->json(500, '文章编辑失败！');
    }
  }

  public function deleteArt() {
    $data = $this->params;
    $art = Db::table('art')->where('art_id', 'eq', $data['art_id'])->find();
    @unlink(ROOT_PATH . 'public' . DS . $art['pic']);
    @unlink(ROOT_PATH . 'public' . DS . $art['suo']);
    $res = Db::table('art')->where('art_id', 'eq', $data['art_id'])->delete();
    if ($res) {
      // 文章添加成功给cat的文章数减1
      Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->setDec('num');
      $this->json(200, '删除文章成功！');
    } else {
      $this->json(500, '删除文章失败！');
    }
  }

  /**
   * 计算浏览量的接口
   */
  public function readnum() {
    $data = $this->params;
    // 给文章的浏览数+1
    $res = Db::table('art')->where('art_id', 'eq', $data['art_id'])->setInc('readnum');
    if ($res) {
      $this->json(200, '');
    } else {
      $this->json(502, $res);
    }
  }

  public function uploadFile($name, $width = 200, $height = 200) {
    $file = $this->request->file($name);
    if (!$file) {
      return false;
    }
    $info = $file->validate(['ext'=> 'jpg,png,gif,jpeg'])->move(ROOT_PATH . 'public' . DS . 'upload');
    if (!$info) {
      $this->json(500, $file->getError());
      return false;
    }
    $url = 'upload/'.$info->getSaveName();
    $data['pic'] = $url;
    $date_path = 'upload/thumb/'.date('Ymd');
    // 目录不存在就创建目录
    if(!file_exists($date_path)){
      mkdir($date_path, 0777, true);
    }
    $thumb_path = $date_path.'/'.$info->getFilename();
    $image = \think\Image::open($url);
    $image->thumb($width, $height)->save($thumb_path);
    $data['suo'] = $thumb_path;
    return $data;
  } 
}