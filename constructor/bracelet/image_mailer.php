<?php
  /*
    $PATH - ����� � ������� ��������������
  */



  // ��������� �����������
  $data = json_decode($_POST['jsonData']);
  $img = str_replace('data:image/png;base64,', '', $data->image);
  $img = str_replace(' ', '+', $img);

  // ���������� �����������
  $PATH = 'render';
  $image_name =  $PATH . "/" . uniqid(). '.png';
  $result = file_put_contents($image_name, base64_decode($img));


  $PATH_URL = "/constructor/constructor/bracelet/";
  $to  = 'rishatsharafiev@ya.ru' . ', '; // �������� �������� �� �������
  $to .= $data->mail;
  // ���� ������
  $subject = '����� �������� Pandora';
  $url = "http://".$_SERVER['SERVER_NAME'] . $PATH_URL . $image_name;
  // ����� ������
  $message = '
  <html>
  <head>
    <title>Birthday Reminders for August</title>
  </head>
  <body>
    <div>Email: '. $data->mail. '</div>
    <div><a href="'.$url.'">���������� ������ ������</a></div>
    <img width="700" src="'.$url.'">
  </body>
  </html>
  ';

  // ��� �������� HTML-������ ������ ���� ���������� ��������� Content-type
  $headers  = 'MIME-Version: 1.0' . "\r\n";
  $headers .= 'Content-type: text/html; charset=utf-8' . "\r\n";

  // �������������� ���������
  $emails = explode(', ', $to);
  // $headers .= 'To: '. $emails[1] . "\r\n";
  $headers .= 'From: '. $emails[0] . "\r\n";
  // $headers .= 'Cc: birthdayarchive@example.com' . "\r\n";
  // $headers .= 'Bcc: birthdaycheck@example.com' . "\r\n";

  // ����������
  mail($to, $subject, $message, $headers);

  echo $url;
?>