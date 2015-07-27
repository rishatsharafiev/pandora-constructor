<?php
  // подключается загрузчик библиотеки
  require 'PHPMailer/PHPMailerAutoload.php';

  /*** конфигурация ***/
  try {
    $MAIL_TO = "rishatsharafiev@ya.ru"; // <обязательно> письма владельцу
    $SMTP_MAIL = "sharafiev.webmoney@gmail.com"; // <обязательно>  почта example@gmail.com, использовать только gmail, иначе нужно переписать конфигурацию smtp ниже
    $SMTP_PASSWORD = "zjmjkeqe"; // <обязательно>  пароль почты.
    $SUBJECT = 'Заказ браслета Pandora';  // <обязательно>  тема письма
    $PATH = 'render'; // <обязательно>  ОБЯЗАТЕЛЬНО НУЖНО СОЗДАТЬ ПАПКУ ПЕРЕД УСТАНОВКОЙ, это название папки в которую положить отрендеренные картинки, ставится относительно текущей директории скрипта
    $SHOP_NAME = $SUBJECT;
    /*** конец конфигурации ***/

    $FULL_URL = 'http://'.$_SERVER['HTTP_HOST'].dirname($_SERVER['PHP_SELF']); // получение полного пути

    // получение json
    $data = json_decode($_POST['jsonData']);
    $img = str_replace('data:image/png;base64,', '', $data->image);
    $img = str_replace(' ', '+', $img);

    // сохранение изображения
    $image_name =  $PATH . "/" . uniqid(). '.png';
    $result = file_put_contents($image_name, base64_decode($img));
    $image_url =  $FULL_URL . '/' . $image_name;

    // отправка сообщения
    $mail = new PHPMailer;
    $mail->isSMTP(); // задать smtp
    $mail->SMTPDebug = 0; // вывод ошибок. 0-без ошибок, 1- ошибки клиенту, 2-ошибки клиенту и серверу.
    $mail->Debugoutput = 'html'; // тип вывода ошибок, html

    $mail->Host = 'mail.nic.ru'; // адрес smpt сервера
    $mail->Port = 465; // порт smpt сервера
    $mail->SMTPSecure = 'ssl';  // шифрование smpt сервера
    $mail->SMTPAuth = true; // авторизация включена

    $mail->Username = $SMTP_MAIL; // имя пользователя email
    $mail->Password = $SMTP_PASSWORD; // пароль пользователя email


    $mail->setFrom($MAIL_TO, $SUBJECT); // от кого приходит сообщение. Первый аргумент почта, второй заголовок от кого
    $mail->addAddress($MAIL_TO, 'Продавец'); //  <необязательно>  сообщение владельцу
    $mail->addAddress($data->mail, 'Покупатель'); //  <необязательно>  сообщение покупателю

    $mail->Subject = $SUBJECT; // тема сообщения
    $mail->Body = '
    <html>
    <head>
      <meta charset="utf-8"/>
      <title>'.$SUBJECT.'</title>
    </head>
    <body>
      <div>Email: '. $data->mail . '</div>
      <div><a href="'. $image_url .'">Посмотреть полную версию картинки</a></div>
      <img width="800" src="'. $image_url .'">
    </body>
    </html>
    ';
    $mail->IsHTML(true); // передавать html
    $mail->CharSet="UTF-8"; // кодировка сообщения
    $mail->send();
    echo $image_url;
  } catch (phpmailerException $e) {
    file_put_contents('error.txt', $e->errorMessage()); //Pretty error messages from PHPMailer
  } catch (Exception $e) {
    file_put_contents('error.txt', $e->getMessage()); //Boring error messages from anything else!
  }

?>