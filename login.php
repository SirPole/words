<?php
use Firebase\JWT\JWT;

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials', TRUE);
header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since");


require_once 'vendor/autoload.php';

$config = json_decode(file_get_contents('config.json'));

$pass = !empty($_POST['pass']) ? trim(htmlspecialchars($_POST['pass'])) : NULL;
$jwt = !empty($_POST['jwt']) ? trim(htmlspecialchars($_POST['jwt'])) : NULL;

if ($jwt) {
	try {
		$token = JWT::decode($jwt, $config->authKey, ['HS512']);
		echo json_encode([
			'authorized' => TRUE,
		]);
	} catch (Exception $e) {
		echo json_encode([
			'authorized' => FALSE,
		]);
	}
} elseif ($pass) {
	if ($pass === $config->authPass) {
		$ts = time();
		$data = [
			'iat' => $ts,
			'nbf' => $ts,
			'iss' => 'words.brychta.name',
		];
		echo json_encode([
			'authorized' => TRUE,
			'jwt' => JWT::encode($data, $config->authKey, 'HS512'),
		]);
	} else {
		echo json_encode([
			'authorized' => FALSE,
		]);
	}
} else {
	header('HTTP/1.0 400 Bad Request');
}
