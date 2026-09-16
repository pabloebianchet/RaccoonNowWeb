<?php
header('Content-Type: application/json; charset=utf-8');

if($_SERVER['REQUEST_METHOD'] !== 'POST'){
    http_response_code(405);
    echo json_encode(['ok'=>false,'error'=>'method_not_allowed']);
    exit;
}

$name = trim($_POST['name'] ?? '');
$email = trim($_POST['email'] ?? '');
$message = trim($_POST['message'] ?? '');
$honeypot = trim($_POST['company_website'] ?? '');

if($honeypot !== ''){
    echo json_encode(['ok'=>true]);
    exit;
}

if($name === '' || $message === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)){
    http_response_code(422);
    echo json_encode(['ok'=>false,'error'=>'invalid_input']);
    exit;
}

$to = 'info@raccoonnow.com';
$subject = 'Nuevo contacto desde raccoonnow.com';
$safeEmail = str_replace(["\r", "\n"], '', $email);
$body = "Nombre: $name\nEmail: $email\n\nMensaje:\n$message\n";
$headers = "From: Raccoon Now Web <no-reply@raccoonnow.com>\r\n";
$headers .= "Reply-To: $safeEmail\r\n";

$sent = mail($to, $subject, $body, $headers);

if($sent){
    echo json_encode(['ok'=>true]);
} else {
    http_response_code(500);
    echo json_encode(['ok'=>false,'error'=>'mail_failed']);
}
