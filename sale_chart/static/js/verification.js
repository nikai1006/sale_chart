$(function () {

  // input iCheck
  $('input').iCheck({
    checkboxClass: 'icheckbox_square-blue',
    radioClass: 'iradio_square-blue',
    increaseArea: '20%' // optional
  });

  // login Form Valid
  var loginFormValid = $("#reset_form").validate({
    errorElement: 'span',
    errorClass: 'help-block',
    focusInvalid: true,
    rules: {
      verification_code: {
        required: true,
        digits: true,
        minlength: 6,
        maxlength: 6,
      },
      password: {
        required: true,
        minlength: 5,
        maxlength: 18
      },
      password_again: {
        equalTo: "#password"
      }
    },
    messages: {
      verification_code: {
        required: '不能为空',
        minlength: '验证码为6位数字',
        maxlength: '验证码为6位数字',
        digits: '验证码为6位数字'
      },
      password: {
        required: '密码不能为空',
        minlength: '密码不能小于5位'
      },
      password_again: {
        equalTo: "两次密码输入不同"
      }
    },
    highlight: function (element) {
      $(element).closest('.form-group').addClass('has-error');
    },
    success: function (label) {
      label.closest('.form-group').removeClass('has-error');
      label.remove();
    },
    errorPlacement: function (error, element) {
      element.parent('div').append(error);
    },
    submitHandler: function (form) {
      var email = $("#email").val();
      var data = {};
      data.email = email;
      data.password = $("#password").val();
      data.verificationCode = $("#verification_code").val();
      $.post("/user/setpasswd", data,
          function (data, status) {
            if (data.code == "0") {
              layer.msg('密码重置成功，请登录');
              setTimeout(function () {
                window.location.href = '/';
              }, 500);
            } else {
              layer.open({
                title: '失败',
                btn: '确定',
                content: (data.msg || '密码重置失败'),
                icon: '2'
              });
            }
          });
    }
  });
});