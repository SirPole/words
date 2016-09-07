<?php


$guid = !empty($_POST['guid']) ? trim(htmlspecialchars($_POST['guid'])) : NULL;
$action = !empty($_POST['action']) ? trim(htmlspecialchars($_POST['action'])) : NULL;
$author = !empty($_POST['author']) ? trim(htmlspecialchars($_POST['author'])) : NULL;
$word = !empty($_POST['word']) ? trim(htmlspecialchars($_POST['word'])) : NULL;
$a = new Action($guid, $action, $author, $word);
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

class Action
{
	private $db, $guid, $action, $author, $word;

	function __construct($guid = NULL, $action = NULL, $author = NULL, $word = NULL)
	{
		$this->db = new mysqli('localhost', 'root', '', 'words');
		$this->db->set_charset("utf8");
		$this->guid = $guid;
		$this->action = $action;
		$this->author = $author;
		$this->word = strtolower($this->utf82ascii($word));
	}

	public function check()
	{
		$sql = "SELECT * FROM `words` WHERE word='$this->word'";
		$result = $this->db->query($sql);
		if ($result->num_rows === 0) {
			return FALSE;
		} else {
			$row = $result->fetch_array(MYSQLI_ASSOC);
			return 'w' . $row['id'];
		}
	}

	public function add()
	{
		$sql = "INSERT INTO `words` (author, word) VALUES ('$this->author', '$this->word')";
		if (substr($this->word, 0, 1) == $this->lastChar()) {
			$this->db->query($sql);
			return FALSE;
		}
		return TRUE;
	}

	public function remove()
	{
		$sql = "DELETE FROM `words` WHERE 1 ORDER BY id DESC LIMIT 1";
		$this->db->query($sql);
	}

	public function reload()
	{
		$sql = "SELECT * FROM `words`";
		$result = $this->db->query($sql);
		$out = '';
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$out .= '<span class="word" id="w' . $row['id'] . '" title="' . $row['author'] . '">' . $row['word'] . '</span>';
		}
		return $out;
	}

	public function lastChar()
	{
		$sql = "SELECT `word` FROM `words` ORDER BY `id` DESC LIMIT 1";
		$result = $this->db->query($sql);
		$out = '';
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$out = substr($row['word'], strlen($row['word']) - 1);
		}
		return $out;
	}

	public function lastWord()
	{
		$sql = "SELECT * FROM `words` ORDER BY `id` DESC LIMIT 1";
		$result = $this->db->query($sql);
		$out = '';
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			if($row['author'] === "Verča") {
				$hrat = " zahrála ";
			} else {
				$hrat = " zahrál ";
			}
			$out = $row['author'] . $hrat . '"' . $row['word'] . '".';
		}
		return $out;
	}

	public function getGuid() {
		return $this->guid;
	}

	public function utf82ascii($text)
	{
		$translateTable = [
			'ä' => 'a',
			'Ä' => 'A',
			'á' => 'a',
			'Á' => 'A',
			'à' => 'a',
			'À' => 'A',
			'ã' => 'a',
			'Ã' => 'A',
			'â' => 'a',
			'Â' => 'A',
			'č' => 'c',
			'Č' => 'C',
			'ć' => 'c',
			'Ć' => 'C',
			'ď' => 'd',
			'Ď' => 'D',
			'ě' => 'e',
			'Ě' => 'E',
			'é' => 'e',
			'É' => 'E',
			'ë' => 'e',
			'Ë' => 'E',
			'è' => 'e',
			'È' => 'E',
			'ê' => 'e',
			'Ê' => 'E',
			'í' => 'i',
			'Í' => 'I',
			'ï' => 'i',
			'Ï' => 'I',
			'ì' => 'i',
			'Ì' => 'I',
			'î' => 'i',
			'Î' => 'I',
			'ľ' => 'l',
			'Ľ' => 'L',
			'ĺ' => 'l',
			'Ĺ' => 'L',
			'ń' => 'n',
			'Ń' => 'N',
			'ň' => 'n',
			'Ň' => 'N',
			'ñ' => 'n',
			'Ñ' => 'N',
			'ó' => 'o',
			'Ó' => 'O',
			'ö' => 'o',
			'Ö' => 'O',
			'ô' => 'o',
			'Ô' => 'O',
			'ò' => 'o',
			'Ò' => 'O',
			'õ' => 'o',
			'Õ' => 'O',
			'ő' => 'o',
			'Ő' => 'O',
			'ř' => 'r',
			'Ř' => 'R',
			'ŕ' => 'r',
			'Ŕ' => 'R',
			'š' => 's',
			'Š' => 'S',
			'ś' => 's',
			'Ś' => 'S',
			'ť' => 't',
			'Ť' => 'T',
			'ú' => 'u',
			'Ú' => 'U',
			'ů' => 'u',
			'Ů' => 'U',
			'ü' => 'u',
			'Ü' => 'U',
			'ù' => 'u',
			'Ù' => 'U',
			'ũ' => 'u',
			'Ũ' => 'U',
			'û' => 'u',
			'Û' => 'U',
			'ý' => 'y',
			'Ý' => 'Y',
			'ž' => 'z',
			'Ž' => 'Z',
			'ź' => 'z',
			'Ź' => 'Z',
		];
		return strtr($text, $translateTable);
	}
}

?>