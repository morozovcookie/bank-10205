<?php
	$uri = $_SERVER['REQUEST_URI'];
	preg_match_all('(([A-z]+)\.([A-z]+))', $uri, $query);
	preg_match_all('([A-z]+)', $query[0][0], $query);
	$class = $query[0][0];
	$method = $query[0][1];
	require_once(dirname(__FILE__).'/router.php');
	$router = router::getInstance();
	require_once(dirname(__FILE__).'/database.php');
	$db = database::getInstance('localhost', 'admin', 'admin', 'bank');
	$object = $router->redirect($class);
	echo json_encode(
		$object->execute($method, $db)
	);
?>