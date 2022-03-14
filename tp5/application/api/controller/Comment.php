<?php
namespace app\api\controller;
use think\Db;
class Comment extends Response
{
  public function getComment() {
    $data = $this->params;
    $res = Db::table('comment')->where('art_id', 'eq', $data['art_id'])->order('comment_id')->select();
    if (is_array($res)) {
      $tree = $this->getTree($res);
      $this->json(200, '', $tree);
    } else {
      $this->json(500, '数据查询失败');
    }
  }

  public function getTree($arr, $parent_id = 0) {
    $tree = array();
    foreach($arr as $c) {
      if ($parent_id == $c['parent_id']) {
        $children = $this->getTree($arr, $c['comment_id']);
        $c['children'] = $children;
        $tree[] = $c;
      }
    }
    return $tree;
  }

  public function addComment() {
    $data = $this->params;
    $userInfo = $this->userInfo;
    $data['pubtime'] = time();
    $data['ip'] = $this->request->ip();
    $data['nick'] = $userInfo['name'];
    $data['user_id'] = $userInfo['user_id'];
    $res = Db::table('comment')->insert($data);
    if ($res) {
      // 评论添加成功给art的评论数加1
      Db::table('art')->where('art_id', 'eq', $data['art_id'])->setInc('comm');
      $this->json(200, '评论添加成功！');
    } else {
      $this->json(500, '评论添加失败！');
    }
  }

  public function deleteComment() {
    $data = $this->params;
    $res = Db::table('comment')->where('comment_id', 'eq', $data['comment_id'])->delete();
    if ($res) {
      $this->json(200, '评论删除成功！');
    } else {
      $this->json(500, '评论删除失败！');
    }
  }
}