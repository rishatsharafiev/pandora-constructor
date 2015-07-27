$(function() {
    var
        $popup_email = $('#popup_email'),
        $basket_button = $("#basket_button"),
        $send_mail = $("#sending_mail"),
        $close_popup_email = $('.close_popup_email'),
        $input_email = $('#input_email'),
        $new_message = $('#new_message'),
        $picture_link = $('#picture_link');

    $basket_button.click(show_popup_email);
    $close_popup_email.click(close_popup_email);
    $close_popup_email.click(close_popup_email);
    $send_mail.click(send_mail);
    $input_email.keyup(check_email);

    function close_popup_email() {
        $input_email.css('border-color', 'rgb(238, 238, 238);');
        $new_message.hide();
        $popup_email.hide(700);
    }

    function show_popup_email() {
        $input_email.css('border-color', 'rgb(238, 238, 238);');
        $new_message.hide();
        $popup_email.show(700);
    }

    function validateEmail(email) {
        var re =  /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z\s]{2,4}$/i;
        return re.test(email);
    }

    function check_email() {
        if( validateEmail( $input_email.val() ) ) {
            $input_email.css('border', '1px green solid');
            return true;
        } else if($input_email.val() == '') {
            $input_email.css('border', '1px rgb(238, 238, 238); solid');
            return false;
        }
        else {
            $input_email.css('border', '1px red solid');
            return false;
        }
    }

    function send_mail() {
        if( check_email() ) {
            ajax_json();
        }
    }

    function ajax_json() {
        var formData = {};

        $clear_button = $('.v2b12.v2button.clear.som-function-caller');
        $clear_button.hide();
        $instructions = $('.instructions_short.float-container');
        $instructions.hide();

        var $canvas = $('#image_wrapper');

        $canvas.css('background-color', '#fff');
        html2canvas($canvas, {
            logging: true,
            allowTaint: true,
            taintTest: true,
            onrendered: function(canvas) {
                var img = canvas.toDataURL("image/png");
                formData['image'] = img;
                $clear_button.show();
                $instructions.show();
                formData['mail'] = $input_email.val();
                $.ajax({
                    url:'phpmailer.php',
                    type:'POST',
                    data:'jsonData=' +JSON.stringify(formData),
                    success: function(res) {
                        $picture_link.text('Посмотреть сборку');
                        $picture_link.attr('href', res);
                    }
                });
                $new_message.show();
            }
        });
    }

});
