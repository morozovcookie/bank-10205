<?php
	class user
	{
		public function __construct()
		{}
		
		public function execute($method, $db = NULL)
		{
			switch ($method)
			{
				case 'auth':
					return $this->auth($db);
				case 'get':
					return $this->get($db);
				case 'passwd':
					return $this->passwd($db);
				case 'pattern':
					return $this->pattern($db);
				case 'setlogo':
					return $this->set_logo();
			}
		}
		
		private function auth($db)
		{
			$username = $_GET['username'];
			settype($username, 'string');
			$password = $_GET['password'];
			settype($password, 'string');
			$query = sprintf("select id from user where username='%s' and password='%s'", $username, $password);
			$result = $db->query($query);
			if ($result->num_rows == 1)
			{
				$result = $result->fetch_assoc();
				$id = $result['id'];
				settype($id, 'integer');
				return array(
					'user' => array(
						'id' => $id,
						'username' => $username
					)
				);
			}
		}

		private function get($db)
		{
			if (isset($_GET['id']))
			{
				$id = $_GET['id'];
				settype($id, 'integer');
				$query = sprintf('select firstname, secondname, username, status from user where id=%d', $id);
			}
			else if (isset($_GET['username']))
			{
				$username = $_GET['username'];
				settype($username, 'string');
				$query = sprintf("select id, firstname, secondname, status from user where username='%s'", $username);
			}
			$result = $db->query($query);
			if ($result->num_rows==1)
			{
				$result = $result->fetch_assoc();
				if (isset($_GET['id']))
				{
					$username = $result['username'];
					settype($username, 'string');
				}
				else if (isset($_GET['username']))
				{
					$id = $result['id'];
					settype($id, 'integer');
				}
				$firstname = $result['firstname'];
				settype($firstname, 'string');
				$secondname = $result['secondname'];
				settype($secondname, 'string');
				$status = $result['status'];
				settype($status, 'string');
				$logo = 'null';
				if (file_exists('/home/morozov/bank/img/user/'.$username.'.png'))
					$logo = 'http://192.168.182.130:90/user/'.$username.'.png';
				return array(
					'user' => array(
						'id' => $id,
						'username' => $username,
						'firstname' => $firstname,
						'secondname' => $secondname,
						'status' => $status,
						'logo' => $logo
					)
				);
			}
		}

		private function passwd($db)
		{
			$id = $_POST['id'];
			settype($id, 'integer');
			$old = $_POST['old'];
			settype($old, 'string');
			$new = $_POST['new'];
			settype($new, 'string');
			$query = sprintf("update user set password='%s' where id=%d and password='%s'", $new, $id, $old);
			$db->query($query);
		}

		private function pattern($db)
		{
			$pattern = $_GET['pattern'];
			settype($pattern, 'string');
			$busy_str = split(',', $_GET['busy']);
			$busy = '';
			for ($i=0; $i < count($busy_str); $i++)
			{
				$busy = $busy."'".$busy_str[$i]."'";
				if ($i<count($busy_str)-1)
					$busy = $busy.",";
			}
			$query = sprintf("select id, username, firstname, secondname from user where username like '%s%%' or firstname like '%s%%' or secondname like '%s%%' and username not in(".$busy.") order by secondname", $pattern, $pattern, $pattern);
			$result = $db->query($query);
			$json = array();
			while ($row = $result->fetch_assoc())
			{
				$id = $row['id'];
				settype($id, 'integer');
				$username = $row['username'];
				settype($username, 'string');
				$firstname = $row['firstname'];
				settype($firstname, 'string');
				$secondname = $row['secondname'];
				settype($secondname, 'string');
				$logo = 'null';
				if (file_exists('/home/morozov/bank/img/user/'.$username.'.png'))
					$logo = 'http://192.168.182.130:90/user/'.$username.'.png';
				$json[] = array(
					'user' => array(
						'id' => $id,
						'username' => $username,
						'firstname' => $firstname,
						'secondname' => $secondname,
						'logo' => $logo
					)
				);
			}
			return $json;
		}

		private function set_logo()
		{
			print_r($_FILES);
			print_r($_POST);
			$username = $_POST['username'];
			$src = $_FILES['file']['tmp_name'];
			$path = '/home/morozov/bank/img/user/'.$username.'.png';
			echo $path;
			move_uploaded_file($src, $path);
		}
	}
?>