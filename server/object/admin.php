<?php
	class admin
	{
		public function __construct()
		{}
		
		public function execute($method, $db = NULL)
		{
			switch ($method)
			{
				case 'rmuser':
					return $this->rmuser($db);
				case 'update_user':
					return $this->update_user($db);
				case 'auth':
					return $this->auth($db);
				case 'addemployee':
					return $this->addemployee($db);
				case 'elist':
					return $this->elist($db);
				case 'ulist':
					return $this->ulist($db);
				case 'createtemplate':
					return $this->create_template($db);
				case 'createicon':
					return $this->create_icon($db);
				case 'tlist':
					return $this->tlist($db);
				case 'savetemplate':
					return $this->save_template($db);
			}
		}

		private function rmuser($db)
		{
			$id = $_POST['id'];
			settype($id, 'integer');
			$query = sprintf("delete from user where id=%d", $id);
			$db->query($query);
		}
		
		private function update_user($db)
		{
			$id = $_POST['id'];
			settype($id, 'integer');
			$username = $_POST['username'];
			settype($username, 'string');
			$secondname = $_POST['secondname'];
			settype($secondname, 'string');
			$firstname = $_POST['firstname'];
			settype($firstname, 'string');
			$query = '';
			if (isset($_POST['password']))
			{
				$password = $_POST['password'];
				#$password = md5($_GET['password']);
				settype($password, 'string');
				$query = sprintf("update user set username='%s', firstname='%s', secondname='%s', password='%s' where id=%d", $username, $firstname, $secondname, $password, $id);
			}
			else
				$query = sprintf("update user set username='%s', firstname='%s', secondname='%s' where id=%d", $username, $firstname, $secondname, $id);
			$db->query($query);
		}

		private function auth($db)
		{
			$username = $_GET['username'];
			settype($username, 'string');
			$password = $_GET['password'];
			#$password = md5($_GET['password']);
			settype($password, 'string');
			$query = sprintf("select id from user where username='%s' and password='%s' and status='admin'", $username, $password);
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
		
		private function addemployee($db)
		{
			$username = $_POST['username'];
			settype($username, 'string');
			$password = $_POST['password'];
			#$password = md5($_GET['password']);
			settype($password, 'string');
			$secondname = $_POST['secondname'];
			settype($secondname, 'string');
			$firstname = $_POST['firstname'];
			settype($firstname, 'string');
			$query = sprintf("insert into user (username, password, firstname, secondname, status) values ('%s', '%s', '%s', '%s', 'employee')", $username, $password, $secondname, $firstname);
			$result = $db->query($query);
		}
		
		private function ulist($db)
		{
			$query = sprintf("select id, username, firstname, secondname, status from user");
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
				$status = $row['status'];
				settype($status, 'string');
				$logo = 'null';
				if (file_exists('/home/morozov/bank/img/user/'.$username.'.png'))
					$logo = 'http://192.168.182.130:90/user/'.$username.'.png';
				$json[] = array(
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
			return $json;
		}
		
		private function elist($db)
		{
			$query = sprintf("select E.id, E.title, E.date, E.sum, U.username from event as E join user as U on E.owner_id=U.id");
			$result = $db->query($query);
			$json = array();
			while ($row = $result->fetch_assoc())
			{
				$id = $row['id'];
				settype($id, 'integer');
				$title = $row['title'];
				settype($username, 'string');
				$date = $row['date'];
				settype($firstname, 'string');
				$sum = $row['sum'];
				settype($secondname, 'float');
				$owner = $row['username'];
				settype($status, 'string');
				$json[] = array(
					'event' => array(
						'id' => $id,
						'title' => $title,
						'date' => $date,
						'sum' => $sum,
						'owner' => $owner
					)
				);
			}
			return $json;
		}
		
		private function create_template($db)
		{
			$id = $_POST['id'];
			settype($id, 'integer');
			$title = $_POST['title'];
			settype($title, 'string');
			$query = sprintf("update template set title='%s' where id='%d'", $title, $id);
			$db->query($query);
		}
		
		private function create_icon($db)
		{
			$server = 'http://192.168.182.130:90/';
			$src = $_FILES['file']['tmp_name'];
			preg_match_all('([0-9A-z]+)', $_FILES['file']['name'], $extension);
			$filename = md5($_FILES['file']['name'] + $_FILES['file']['tmp_name']).'.'.$extension[0][1];
			$path = '/home/morozov/bank/img/template/'.$filename;
			move_uploaded_file($src, $path);
			$query = sprintf("insert into template (title, img) values ('', '".$server."template/".$filename."')");
			$db->query($query);
			return array(
				'id' => $db->last_id()
			);
		}
		
		private function tlist($db)
		{
			$query = sprintf("select * from template");
			$result = $db->query($query);
			$json = array();
			while ($row = $result->fetch_assoc())
			{
				$id = $row['id'];
				settype($id, 'integer');
				$title = $row['title'];
				settype($title, 'string');
				$src = $row['img'];
				settype($src, 'string');
				$json[] = array(
					'template' => array(
						'id' => $id,
						'title' => $title,
						'src' => $src
					)
				);
			}
			return $json;
		}
		
		private function save_template($db)
		{
			$filename = '/home/morozov/bank/'.$_POST['title'].'.html';
			file_put_contents($filename, $_POST['content']);
			return $_POST['content'];
		}
	}
?>