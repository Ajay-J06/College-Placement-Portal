/* ===========================================================
   PlacementPro Admin — login.js
   Handles index.html (login) and forgot-password.html
   =========================================================== */

(function () {
  'use strict';

  var DEMO_EMAIL = 'admin@placementpro.edu';
  var DEMO_PASSWORD = 'admin123';

  /* ===================== PAGE LOADER ===================== */
  function hideLoader() {
    var loader = document.getElementById('pageLoader');
    if (!loader) return;
    setTimeout(function () { loader.classList.add('hidden'); }, 350);
  }

  if (document.readyState === 'complete') hideLoader();
  else {
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 1500);
  }

  /* ===================== TOAST ===================== */
  /* Lightweight local copy in case app.js isn't loaded */
  if (!window.toast) {
    var toastContainer = document.createElement('div');
    toastContainer.className = 'toast-container';
    document.body.appendChild(toastContainer);

    var ICONS = {
      success: 'fa-solid fa-circle-check',
      error: 'fa-solid fa-circle-xmark',
      warning: 'fa-solid fa-triangle-exclamation',
      info: 'fa-solid fa-circle-info'
    };

    window.toast = function (type, title, message, duration) {
      type = ICONS[type] ? type : 'info';
      duration = duration || 3800;

      var el = document.createElement('div');
      el.className = 'toast toast-' + type;

      var div = document.createElement('div');

      div.textContent = title || '';
      var safeTitle = div.innerHTML;

      div.textContent = message || '';
      var safeMsg = div.innerHTML;

      el.innerHTML =
        '<i class="toast-icon ' + ICONS[type] + '"></i>' +
        '<div class="toast-content">' +
          '<div class="toast-title">' + safeTitle + '</div>' +
          (
            message
              ? '<div class="toast-msg">' + safeMsg + '</div>'
              : ''
          ) +
        '</div>' +
        '<i class="toast-close fa-solid fa-xmark"></i>';

      toastContainer.appendChild(el);

      var timer = setTimeout(dismiss, duration);

      el.querySelector('.toast-close')
        .addEventListener('click', dismiss);

      function dismiss() {
        clearTimeout(timer);
        el.classList.add('hide');

        setTimeout(function () {
          el.remove();
        }, 220);
      }
    };
  }

  /* ===================== VALIDATION HELPERS ===================== */

  var EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  function showError(inputId, message) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(inputId + 'Error');

    if (input) {
      input.classList.add('is-invalid');
    }

    if (err) {
      err.textContent = message;
      err.classList.add('show');
    }
  }

  function clearError(inputId) {
    var input = document.getElementById(inputId);
    var err = document.getElementById(inputId + 'Error');

    if (input) {
      input.classList.remove('is-invalid');
    }

    if (err) {
      err.textContent = '';
      err.classList.remove('show');
    }
  }

  function setLoading(btn, on) {
    if (!btn) return;

    btn.classList.toggle('is-loading', on);
    btn.disabled = on;
  }

  /* ===================== SHOW / HIDE PASSWORD ===================== */

  document
    .querySelectorAll('.password-toggle')
    .forEach(function (icon) {

      icon.addEventListener('click', function () {

        var targetId =
          icon.getAttribute('data-target');

        var input =
          document.getElementById(targetId);

        if (!input) return;

        var isHidden =
          input.type === 'password';

        input.type =
          isHidden ? 'text' : 'password';

        icon.classList.toggle(
          'fa-eye',
          !isHidden
        );

        icon.classList.toggle(
          'fa-eye-slash',
          isHidden
        );
      });
    });

  /* ===================== LOGIN FORM ===================== */

  var loginForm =
    document.getElementById('loginForm');

  if (loginForm) {

    var loginEmail =
      document.getElementById('loginEmail');

    var loginPassword =
      document.getElementById('loginPassword');

    var loginBtn =
      document.getElementById('loginSubmitBtn');

    loginForm.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();

        clearError('loginEmail');
        clearError('loginPassword');

        var emailVal =
          loginEmail.value.trim();

        var passVal =
          loginPassword.value;

        var valid = true;

        /* Validate Email */

        if (!emailVal) {
          showError(
            'loginEmail',
            'Email address is required.'
          );

          valid = false;

        } else if (!EMAIL_RE.test(emailVal)) {

          showError(
            'loginEmail',
            'Enter a valid email address.'
          );

          valid = false;
        }

        /* Validate Password */

        if (!passVal) {

          showError(
            'loginPassword',
            'Password is required.'
          );

          valid = false;

        } else if (passVal.length < 6) {

          showError(
            'loginPassword',
            'Password must be at least 6 characters.'
          );

          valid = false;
        }

        if (!valid) return;

        setLoading(loginBtn, true);

        setTimeout(function () {

          if (
            emailVal.toLowerCase() === DEMO_EMAIL &&
            passVal === DEMO_PASSWORD
          ) {

            try {

              var rememberMe =
                document.getElementById('rememberMe');

              if (
                rememberMe &&
                rememberMe.checked
              ) {
                localStorage.setItem(
                  'pp_remember_email',
                  emailVal
                );
              }

              sessionStorage.setItem(
                'pp_logged_in',
                '1'
              );

            } catch (err) {
              /* Ignore storage errors */
            }

            window.toast(
              'success',
              'Welcome back!',
              'Redirecting to your dashboard…'
            );

            setTimeout(function () {
              window.location.href =
                'dashboard.html';
            }, 700);

          } else {

            setLoading(loginBtn, false);

            showError(
              'loginPassword',
              'Invalid email or password.'
            );

            window.toast(
              'error',
              'Login failed',
              'Check your credentials and try again.'
            );
          }

        }, 900);
      }
    );

    /* ===================== REMEMBER EMAIL ===================== */

    try {

      var remembered =
        localStorage.getItem(
          'pp_remember_email'
        );

      if (
        remembered &&
        loginEmail
      ) {

        loginEmail.value = remembered;

        var rememberBox =
          document.getElementById('rememberMe');

        if (rememberBox) {
          rememberBox.checked = true;
        }
      }

    } catch (err) {
      /* Ignore storage errors */
    }

    /* ===================== CLEAR ERRORS WHILE TYPING ===================== */

    [
      loginEmail,
      loginPassword
    ].forEach(function (input) {

      if (!input) return;

      input.addEventListener(
        'input',
        function () {
          clearError(input.id);
        }
      );
    });
  }

  /* ===================== FORGOT PASSWORD FORM ===================== */

  var forgotForm =
    document.getElementById('forgotForm');

  if (forgotForm) {

    var forgotEmail =
      document.getElementById('forgotEmail');

    var forgotBtn =
      document.getElementById('forgotSubmitBtn');

    var formView =
      document.getElementById('forgotFormView');

    var successView =
      document.getElementById('forgotSuccessView');

    var sentToEmail =
      document.getElementById('sentToEmail');

    var resendBtn =
      document.getElementById('resendLinkBtn');

    forgotForm.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();

        clearError('forgotEmail');

        var emailVal =
          forgotEmail.value.trim();

        if (!emailVal) {

          showError(
            'forgotEmail',
            'Email address is required.'
          );

          return;
        }

        if (!EMAIL_RE.test(emailVal)) {

          showError(
            'forgotEmail',
            'Enter a valid email address.'
          );

          return;
        }

        setLoading(
          forgotBtn,
          true
        );

        setTimeout(function () {

          setLoading(
            forgotBtn,
            false
          );

          if (sentToEmail) {
            sentToEmail.textContent =
              emailVal;
          }

          if (formView) {
            formView.style.display =
              'none';
          }

          if (successView) {
            successView.style.display =
              'block';
          }

          window.toast(
            'success',
            'Reset link sent',
            'Check your inbox for further instructions.'
          );

        }, 900);
      }
    );

    forgotEmail &&
      forgotEmail.addEventListener(
        'input',
        function () {
          clearError('forgotEmail');
        }
      );

    /* ===================== RESEND RESET LINK ===================== */

    if (resendBtn) {

      resendBtn.addEventListener(
        'click',
        function () {

          setLoading(
            resendBtn,
            true
          );

          setTimeout(function () {

            setLoading(
              resendBtn,
              false
            );

            window.toast(
              'info',
              'Link resent',
              'A new reset link is on its way.'
            );

          }, 800);
        }
      );
    }
  }

})();