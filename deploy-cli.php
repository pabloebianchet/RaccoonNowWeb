<?php
$log = '/home/c2421385/public_html/deploy-log.txt';
$dest = '/home/c2421385/public_html';
$zipUrl = 'https://github.com/pabloebianchet/RaccoonNowWeb/archive/refs/heads/main.zip';
$tmpZip = '/home/c2421385/public_html/_tmp_deploy.zip';
$tmpDir = '/home/c2421385/public_html/_tmp_deploy_extract';

function logmsg($log, $msg){
    $line = "[" . date('c') . "] " . $msg . "\n";
    $existing = file_exists($log) ? file_get_contents($log) : '';
    $lines = array_filter(explode("\n", $existing));
    $lines = array_slice($lines, -50);
    file_put_contents($log, implode("\n", $lines) . "\n" . $line);
}

function safeCopy($s, $d){
    $size = filesize($s);
    if($size === false) return false;
    $tmp = $d . '.tmp_' . uniqid();
    if(!copy($s, $tmp)) { @unlink($tmp); return false; }
    if(filesize($tmp) !== $size) { @unlink($tmp); return false; }
    return rename($tmp, $d);
}

function rcopy($src, $dst){
    if(!is_dir($dst)) mkdir($dst, 0755, true);
    $dir = opendir($src);
    $failed = [];
    while(($file = readdir($dir)) !== false){
        if($file === '.' || $file === '..') continue;
        $s = $src . '/' . $file;
        $d = $dst . '/' . $file;
        if(is_dir($s)){
            $failed = array_merge($failed, rcopy($s, $d));
        } else {
            if(!safeCopy($s, $d)) $failed[] = $d;
        }
    }
    closedir($dir);
    return $failed;
}

function rrmdir($dir){
    if(!is_dir($dir)) return;
    foreach(scandir($dir) as $item){
        if($item === '.' || $item === '..') continue;
        $path = $dir . '/' . $item;
        if(is_dir($path)) rrmdir($path);
        else unlink($path);
    }
    rmdir($dir);
}

try {
    if(function_exists('curl_init')){
        $ch = curl_init($zipUrl);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_FOLLOWLOCATION, true);
        curl_setopt($ch, CURLOPT_TIMEOUT, 60);
        curl_setopt($ch, CURLOPT_USERAGENT, 'RaccoonNow-Deploy');
        $data = curl_exec($ch);
        if($data === false) throw new Exception('curl error: ' . curl_error($ch));
        curl_close($ch);
    } elseif(ini_get('allow_url_fopen')){
        $ctx = stream_context_create(['http' => ['timeout' => 60, 'header' => "User-Agent: RaccoonNow-Deploy\r\n"]]);
        $data = @file_get_contents($zipUrl, false, $ctx);
        if($data === false) throw new Exception('file_get_contents fallo y curl no esta disponible');
    } else {
        throw new Exception('Ni curl ni allow_url_fopen estan disponibles');
    }

    file_put_contents($tmpZip, $data);

    if(!class_exists('ZipArchive')) throw new Exception('La extension ZipArchive no esta disponible');

    $zip = new ZipArchive();
    if($zip->open($tmpZip) !== true) throw new Exception('No se pudo abrir el zip descargado');

    if(is_dir($tmpDir)) rrmdir($tmpDir);
    mkdir($tmpDir, 0755, true);
    $zip->extractTo($tmpDir);
    $zip->close();
    unlink($tmpZip);

    $dirs = glob($tmpDir . '/*', GLOB_ONLYDIR);
    if(empty($dirs)) throw new Exception('No se encontro la carpeta extraida del zip');
    $src = $dirs[0];

    $items = ['assets','en','es','it','index.html','automatizacion-ia.html','.htaccess','robots.txt','sitemap.xml','googlee77c63d4a3e671af.html','logo.webp','contact.php'];
    $copied = [];
    $failed = [];
    foreach($items as $item){
        $from = $src . '/' . $item;
        $to = $dest . '/' . $item;
        if(!file_exists($from)) continue;
        if(is_dir($from)){
            $failed = array_merge($failed, rcopy($from, $to));
        } elseif(!safeCopy($from, $to)){
            $failed[] = $to;
        }
        $copied[] = $item;
    }

    rrmdir($tmpDir);
    if(!empty($failed)){
        logmsg($log, 'PARCIAL - copiado: ' . implode(', ', $copied) . ' | FALLARON: ' . implode(', ', $failed));
    } else {
        logmsg($log, 'OK - copiado: ' . implode(', ', $copied));
    }
} catch (Exception $e){
    logmsg($log, 'ERROR: ' . $e->getMessage());
}
