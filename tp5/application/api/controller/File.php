<?php
namespace app\api\controller;
use think\Db;
class File extends Response
{
  public function uploadImage() {
    $data = $this->params;
    $data['pubtime'] = time();
    $file = $this->request->file('file');
    $info = $file->validate(['ext'=> 'jpg,png,gif,jpeg'])->move(ROOT_PATH . 'public' . DS . 'upload');
    if (!$info) {
      $this->json(500, $upload->getError());
    }
    $url = 'upload/'.$info->getSaveName();
    $data['url'] = $url;
    $date_path = 'upload/thumb/'.date('Ymd');
    if(!file_exists($date_path)){
      mkdir($date_path, 0777, true);
    }
    $thumb_path = $date_path.'/'.$info->getFilename();
    $image = \think\Image::open($url);
    $image->thumb(200, 200)->save($thumb_path);
    $data['suo'] = $thumb_path;
    $res = Db::table('file')->insert($data);
    if ($res) {
      $this->json(200, '图片上传成功！', array('url' => $url));
    } else {
      $this->json(500, '图片上传失败！');
    }
  }
}