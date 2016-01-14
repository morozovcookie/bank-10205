<?php
	require_once(dirname(__FILE__).'/object/user.php');
	require_once(dirname(__FILE__).'/object/admin.php');
	require_once(dirname(__FILE__).'/object/event.php');
	
	class router
	{
		private static $instance;
		
		public static function getInstance()
		{
			if (empty(self::$instance))
				self::$instance = new self();
			return self::$instance;
		}
		
		public function redirect($class)
		{
			switch ($class)
			{
				case 'user':
					return new user();
				case 'admin':
					return new admin();
				case 'event':
					return new event();
			}
		}
		
		private function __construct()
		{}
		
		private function __clone()
		{}
		
		private function __wakeup()
		{}
	}
?>