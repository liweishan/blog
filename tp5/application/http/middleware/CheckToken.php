<?php

namespace app\http\middleware;

class Check
{
  public function handle($request, \Closure $next)
  {
    // 添加中间件执行代码
    echo '1';
    return $next($request);
  }
}