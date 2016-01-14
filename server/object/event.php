<?php
	class event
	{
		public function __construct()
		{}
		
		public function execute($method, $db = NULL)
		{
			switch ($method)
			{
				case 'create':
					return $this->create($db);
			}
		}
		
		private function create($db)
		{
			print_r($_POST);
			echo '<br>';
			print_r($_FILES);
			echo '<br>';
		}
	}
?>