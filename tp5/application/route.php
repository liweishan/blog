<?php
use Think\Route;

// Route::domain('api', 'api');

// 获取栏目
Route::get('getCat', 'cat/getCat');

// 添加栏目
Route::post('addCat', 'cat/addCat');

// 编辑栏目
Route::post('editCat', 'cat/editCat');

// 删除栏目
Route::post('deleteCat', 'cat/deleteCat');

// 获取文章（分页）
Route::get('getArt', 'art/getArt');

// 获取所有文章
Route::get('getArtAll', 'art/getArtAll');

// 获取文章详情
Route::get('getArtDetails', 'art/getArtDetails');

// 添加文章
Route::post('addArt', 'art/addArt');

// 编辑文章
Route::post('editArt', 'art/editArt');

// 删除文章
Route::post('deleteArt', 'art/deleteArt');

// 删除文章
Route::post('readnum', 'art/readnum');

// 获取评论
Route::get('getComment', 'comment/getComment');

// 添加评论
Route::post('addComment', 'comment/addComment');

// 删除评论
Route::post('deleteComment', 'comment/deleteComment');

// 用户登录
Route::post('login', 'user/login');

// 用户注册
Route::post('register', 'user/register');

// 发送验证码
Route::post('sms', 'user/sms');

// 修改密码
Route::post('editPwd', 'user/editPwd');

// 找回密码
Route::post('retrievePwd', 'user/retrievePwd');

// 上传图片
Route::post('uploadImage', 'file/uploadImage');