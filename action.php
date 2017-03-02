<?php

$guid = !empty($_POST['guid']) ? trim(htmlspecialchars($_POST['guid'])) : NULL;
$action = !empty($_POST['action']) ? trim(htmlspecialchars($_POST['action'])) : NULL;
$author = !empty($_POST['author']) ? trim(htmlspecialchars($_POST['author'])) : NULL;
$word = !empty($_POST['word']) ? trim(htmlspecialchars($_POST['word'])) : NULL;
$a = new Api($guid, $action, $author, $word);
$out = [];

switch ($action) {
	case 'check':
		$out['err'] = $a->check();
		break;
	case 'add':
		$out['err'] = $a->check();
		if ($out['err'] === FALSE) {
			$out['err'] = $a->add();
		}
		break;
	case 'remove':
		$a->remove();
		break;
}
$out['data'] = $a->reload();
$out['lastWord'] = $a->lastWord();
$out['lastChar'] = $a->lastChar();
$out['guid'] = $a->getGuid();
echo json_encode($out);
