<?php
$secret = 'be2063f265a43c37df0cc43f439c401ca89d1d83a40ec794';

if(($_GET['token'] ?? '') !== $secret){
    http_response_code(403);
    header('Content-Type: text/plain');
    echo 'forbidden';
    exit;
}

header('Content-Type: text/plain');

$repo = '/home/c2421385/public_html/_repo';
$dest = '/home/c2421385/public_html';

$items = 'assets en es it index.html automatizacion-ia.html .htaccess robots.txt sitemap.xml googlee77c63d4a3e671af.html logo.webp contact.php';

$cmd = "cd $repo && git pull origin main 2>&1 && cp -r $items $dest/ 2>&1";

if(!function_exists('shell_exec')){
    echo "shell_exec no está disponible en este hosting.\n";
    exit;
}

$output = shell_exec($cmd);
echo $output === null ? "El comando no devolvió salida (puede haber fallado silenciosamente).\n" : $output;
