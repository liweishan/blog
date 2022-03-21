<?php
namespace app\api\controller;
use think\Db;
class Cat extends Response
{
  public function getCat() {
    // var_dump(THINK_VERSION);
    $res = Db::table('cat')->select();
    if (is_array($res)) {
      $this->json(200, '', $res);
    } else {
      $this->json(500, '数据查询失败！');
    }
  }

  public function addCat() {
    $data = $this->params;
    $res = Db::table('cat')->insert($data);
    if ($res) {
      $catId = Db::table('cat')->getLastInsID();
      $row = Db::table('cat')->where('cat_id', 'eq', $catId)->select();
      $this->json(200, '栏目添加成功！', $row[0]);
    } else {
      $this->json(500, '栏目添加失败！');
    }
  }

  public function editCat() {
    $data = $this->params;
    $res = Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->update($data);
    if ($res) {
      $this->json(200, '栏目编辑成功！');
    } else {
      $this->json(500, '栏目编辑失败！');
    }
  }

  public function deleteCat() {
    $data = $this->params;
    $res = Db::table('cat')->where('cat_id', 'eq', $data['cat_id'])->delete();
    if ($res) {
      $this->json(200, '删除栏目成功！');
    } else {
      $this->json(500, '删除栏目失败！');
    }
  }
}