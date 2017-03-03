<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Credentials', true);
header("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
header("Access-Control-Allow-Headers", "Authorization, Content-Type, Accept, Origin, User-Agent, DNT, Cache-Control, X-Mx-ReqToken, Keep-Alive, X-Requested-With, If-Modified-Since");

require_once 'src/api/Api.php';

$action = !empty($_POST['action']) ? trim(htmlspecialchars($_POST['action'])) : NULL;
$author = !empty($_POST['author']) ? trim(htmlspecialchars($_POST['author'])) : NULL;
$word = !empty($_POST['word']) ? trim(htmlspecialchars($_POST['word'])) : NULL;
$a = new Api($action, $author, $word);
$out = [];
$data = $a->reload();

switch ($action) {
	case 'init':
		$out['data'] = json_encode($data);
		break;
	case 'add':
		$out['err'] = $a->check();
		if ($out['err'] === 0) {
			$out['err'] = $a->add();
		}
		break;
	case 'remove':
		$a->remove();
		break;
}
$out['wordCount'] = count($data);
$out['lastWord'] = $a->lastWord();
$out['lastChar'] = $a->lastChar();
echo json_encode($out);
