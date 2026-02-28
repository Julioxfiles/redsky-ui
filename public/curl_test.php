<?php

//$ch = curl_init('http://api.skynet.local/api/users');
$ch = curl_init('http://api.skynet.local/api/auth/login');

curl_setopt_array($ch, [
    CURLOPT_RETURNTRANSFER => true,
]);

$response = curl_exec($ch);

if ($response === false) {
    var_dump(curl_errno($ch));
    var_dump(curl_error($ch));
    exit;
}

curl_close($ch);

var_dump($response);