/*
 *
 * login-register modal
 * Autor: Creative Tim
 * Web-autor: creative.tim
 * Web script: http://creative-tim.com
 * 
 */
function showRegisterForm(){
    $('.loginBox').fadeOut('fast',function(){
        $('.registerBox').fadeIn('fast');
        $('.login-footer').fadeOut('fast',function(){
            $('.register-footer').fadeIn('fast');
        });
        $('.modal-title').html('<div class="logo-logo"><img class="logo1" width="100" src="../images/images%20(1).png" alt="logo"></div>');
    }); 
    $('.error').removeClass('alert alert-danger').html('');
       
}
function showLoginForm(){
    $('#loginModal').find('.registerBox').fadeOut('fast',function(){
        $('.loginBox').fadeIn('fast');
        $('.register-footer').fadeOut('fast',function(){
            $('.login-footer').fadeIn('fast');    
        });
        
        $('.modal-title').html('<div class="logo-logo"><img class="logo1" width="100" src="../images/images%20(1).png" alt="logo"></div>');
    });       
     $('.error').removeClass('alert alert-danger').html(''); 
}

function openLoginModal(){
    showLoginForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}
function openRegisterModal(){
    showRegisterForm();
    setTimeout(function(){
        $('#loginModal').modal('show');    
    }, 230);
    
}

function loginAjax(){
    /*   Remove this comments when moving to server */

       var email= $('input[name="email"]').val(),
        password = $('input[name="password"]').val();

        if (email == '' || password == ''){
            var message = "Invalid email/password combination";
            shakeModal(message);

        }else{
            $.ajax({
                type:'POST',
                url:'/login',
                data:  {email: email, password:password},
                success:function(result){
                    console.log(result);
                    if(!result){
                        console.log(result)
                        //$('form input[name="username"]').css("background-color", "red");
                    }

                },
                error: function (xhr, ajaxOptions, thrownError) {
                    console.log(xhr.status);
                    console.log(thrownError);
                }
            });

        }


/*   Simulate error message from the server   */
     // shakeModal();
}


function registerAjax() {
    var email = $('input[name="email"]').val(),
        password = $('input[name="password"]').val(),
        fullname= $('input[name="fullname"]').val();
    if(email.length == 0){
        var message = "Fields cannot be empty";
         shakeModal(message);
    }else {
        return false;
    }
}

function shakeModal(message){
    $('#loginModal').find('.modal-dialog').addClass('shake');
             $('.error').addClass('alert alert-danger').html(message);
             $('input[type="password"]').val('');
             setTimeout( function(){ 
                $('#loginModal').find('.modal-dialog').removeClass('shake');
    }, 1000 );

}

   