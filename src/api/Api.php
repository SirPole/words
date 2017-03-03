<?php

class Api
{
	private $db, $action, $author, $word;

	function __construct($action = NULL, $author = NULL, $word = NULL)
	{
		$this->db = new mysqli('brychta.name', 'sirpole', 'polpol', 'words');
		$this->db->set_charset("utf8");
		$this->action = $action;
		$this->author = $author;
		$this->word = strtolower($this->utf82ascii($word));
	}

	public function check()
	{
		$sql = "SELECT `id` FROM `words` WHERE word='$this->word'";
		$result = $this->db->query($sql);
		if ($result->num_rows === 0) {
			return 0;
		}
		return -(int)$result->fetch_array(MYSQLI_ASSOC)['id'];
	}

	public function add()
	{
		$sql = "INSERT INTO `words` (author, word) VALUES ('$this->author', '$this->word'); SELECT `id` FROM `words` ORDER BY `id` DESC LIMIT 1";
		$lastChar = $this->lastChar();
		if (substr($this->word, 0, strlen($lastChar)) == $lastChar) {
			$result = $this->db->query($sql);
			return $result->fetch_array(MYSQLI_ASSOC)['id'];
		}
		return 0;
	}

	public function remove()
	{
		$sql = "DELETE FROM `words` WHERE 1 ORDER BY id DESC LIMIT 1";
		$result = $this->db->query($sql);
		if ($result) {
			return 0;
		}
		return -1;
	}

	public function reload()
	{
		$sql = "SELECT * FROM `words`";
		$result = $this->db->query($sql);
		$out = [];
		while ($row = $result->fetch_array(MYSQLI_ASSOC)) {
			$out[] = ['id' => $row['id'], 'author' => $row['author'], 'word' => $row['word']];
		}
		return $out;
	}

	public function lastChar()
	{
		$sql = "SELECT `word` FROM `words` ORDER BY `id` DESC LIMIT 1";
		$result = $this->db->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		$out = substr($row['word'], strlen($row['word']) - 2);
		if ($out !== 'ch') {
			$out = substr($row['word'], strlen($row['word']) - 1);
		}
		return $out;
	}

	public function lastWord()
	{
		$sql = "SELECT * FROM `words` ORDER BY `id` DESC LIMIT 1";
		$result = $this->db->query($sql);
		$row = $result->fetch_array(MYSQLI_ASSOC);
		return $row['author'] . ' played "' . $row['word'] . '"';
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
