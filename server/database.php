<?php
	class database
	{
		private static $instance;
		
		public static function getInstance($host, $login, $pass, $db)
		{
			if (empty(self::$instance))
				self::$instance = new self($host, $login, $pass, $db);
			return self::$instance;
		}
		
		public function query($query)
		{
			return $this->db->query($query);
		}
		
		public function error()
		{
			return $this->db->error;
		}
		
		public function last_id()
		{
			return $this->db->insert_id;
		}
		
		private function __construct($host, $login, $pass, $db)
		{
			$this->db = new mysqli($host, $login, $pass, $db);
			if ($this->db->connect_errno)
			{
				printf('Connection error');
				exit();
			}
			$this->db->query('set names utf8');
		}
	
		private function __clone()
		{}
		
		private function __wakeup()
		{}
		
		private $db;
	}
?>