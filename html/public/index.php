<?php

ini_set('default_charset', 'UTF-8');

// check for post request
if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    header('HTTP/1.1 405 Method Not Allowed');
    exit();
}

// check for json
if ($_SERVER['CONTENT_TYPE'] !== 'application/json; charset=utf-8') {
    header('HTTP/1.1 400 Bad Request');
    exit();
}

// get post data
$data = file_get_contents('php://input');

file_put_contents('result.json', json_encode($data));

header('HTTP/1.1 200 OK');
header('Content-Type: application/json');

$response = [
    "a" => "all ok",
];

echo(json_encode($response));

exit();
