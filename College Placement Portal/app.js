/* ===========================================================
   PlacementPro Admin — app.js
   Shared application helpers and student data management
   =========================================================== */

(function () {
  'use strict';

  /* ===================== DEMO LOGIN ===================== */

  var DEMO_EMAIL = 'admin@placementpro.edu';
  var DEMO_PASSWORD = 'admin123';

  /* ===================== STORAGE KEYS ===================== */

  var STORAGE_KEY = 'placementpro_students';

  /* ===================== DEFAULT STUDENT DATA ===================== */

  var DEFAULT_STUDENTS = [
    {
      id: 'STU001',
      name: 'Arun Kumar',
      registerNumber: '22BIT001',
      department: 'Information Technology',
      year: '3rd Year',
      email: 'arun.kumar@example.com',
      phone: '+91 98765 43210',
      address: 'Coimbatore, Tamil Nadu',
      cgpa: 8.9,
      arrears: 0,
      skills: ['Python', 'Java', 'HTML', 'CSS'],
      verification: 'verified',
      placementStatus: 'Eligible',
      resumeFileName: 'Arun_Kumar_Resume.pdf',
      projects: [
        {
          title: 'College Placement Portal',
          desc: 'A web application for managing students, jobs and applications.'
        }
      ]
    },

    {
      id: 'STU002',
      name: 'Priya Sharma',
      registerNumber: '22BIT002',
      department: 'Computer Science',
      year: '3rd Year',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 12345',
      address: 'Chennai, Tamil Nadu',
      cgpa: 9.1,
      arrears: 0,
      skills: ['Java', 'MySQL', 'JavaScript'],
      verification: 'pending',
      placementStatus: 'Eligible',
      resumeFileName: 'Priya_Sharma_Resume.pdf',
      projects: [
        {
          title: 'Student Management System',
          desc: 'A system for managing student information and academic records.'
        }
      ]
    },

    {
      id: 'STU003',
      name: 'Rahul Raj',
      registerNumber: '22BIT003',
      department: 'Electronics and Communication',
      year: '3rd Year',
      email: 'rahul.raj@example.com',
      phone: '+91 97865 43210',
      address: 'Madurai, Tamil Nadu',
      cgpa: 7.8,
      arrears: 1,
      skills: ['C', 'Python', 'IoT'],
      verification: 'rejected',
      placementStatus: 'Not Eligible',
      resumeFileName: 'Rahul_Raj_Resume.pdf',
      projects: [
        {
          title: 'IoT Smart Home',
          desc: 'An IoT-based smart home automation project.'
        }
      ]
    }
  ];

  /* ===================== INITIALIZE STORAGE ===================== */

  function initializeStudents() {
    try {
      var stored = localStorage.getItem(STORAGE_KEY);

      if (!stored) {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify(DEFAULT_STUDENTS)
        );
      }
    } catch (error) {
      console.error('Unable to initialize student data:', error);
    }
  }

  /* ===================== GET STUDENTS ===================== */

  function getStudents() {
    initializeStudents();

    try {
      var data = localStorage.getItem(STORAGE_KEY);

      if (!data) {
        return DEFAULT_STUDENTS.slice();
      }

      return JSON.parse(data);
    } catch (error) {
      console.error('Unable to load students:', error);
      return DEFAULT_STUDENTS.slice();
    }
  }

  /* ===================== SAVE STUDENTS ===================== */

  function saveStudents(students) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(students)
      );

      return true;
    } catch (error) {
      console.error('Unable to save students:', error);
      return false;
    }
  }

  /* ===================== FIND STUDENT ===================== */

  function findStudent(id) {
    var students = getStudents();

    return students.find(function (student) {
      return student.id === id;
    });
  }

  /* ===================== ADD STUDENT ===================== */

  function addStudent(student) {
    var students = getStudents();

    students.push(student);

    return saveStudents(students);
  }

  /* ===================== UPDATE STUDENT ===================== */

  function updateStudent(id, updatedData) {
    var students = getStudents();

    var index = students.findIndex(function (student) {
      return student.id === id;
    });

    if (index === -1) {
      return false;
    }

    students[index] = Object.assign(
      {},
      students[index],
      updatedData
    );

    return saveStudents(students);
  }

  /* ===================== DELETE STUDENT ===================== */

  function deleteStudent(id) {
    var students = getStudents();

    students = students.filter(function (student) {
      return student.id !== id;
    });

    return saveStudents(students);
  }

  /* ===================== GENERATE STUDENT ID ===================== */

  function generateStudentId() {
    var students = getStudents();

    var highestNumber = 0;

    students.forEach(function (student) {
      var number = parseInt(
        String(student.id).replace(/\D/g, ''),
        10
      );

      if (!isNaN(number) && number > highestNumber) {
        highestNumber = number;
      }
    });

    var nextNumber = highestNumber + 1;

    return 'STU' + String(nextNumber).padStart(3, '0');
  }

  /* ===================== ESCAPE HTML ===================== */

  function escapeHtml(value) {
    if (value === null || value === undefined) {
      return '';
    }

    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }

  /* ===================== DEBOUNCE ===================== */

  function debounce(callback, delay) {
    var timeout;

    return function () {
      var context = this;
      var args = arguments;

      clearTimeout(timeout);

      timeout = setTimeout(function () {
        callback.apply(context, args);
      }, delay);
    };
  }

  /* ===================== TOAST NOTIFICATIONS ===================== */

  function createToastContainer() {
    var container = document.getElementById('toastContainer');

    if (!container) {
      container = document.createElement('div');
      container.id = 'toastContainer';
      container.className = 'toast-container';

      document.body.appendChild(container);
    }

    return container;
  }

  function showToast(type, title, message, duration) {
    duration = duration || 3500;

    var container = createToastContainer();

    var icons = {
      success: 'fa-circle-check',
      error: 'fa-circle-xmark',
      warning: 'fa-triangle-exclamation',
      info: 'fa-circle-info'
    };

    var icon = icons[type] || icons.info;

    var toast = document.createElement('div');

    toast.className = 'toast toast-' + type;

    var safeTitle = escapeHtml(title);
    var safeMessage = escapeHtml(message);

    toast.innerHTML =
      '<div class="toast-icon">' +
        '<i class="fa-solid ' + icon + '"></i>' +
      '</div>' +

      '<div class="toast-content">' +
        '<div class="toast-title">' +
          safeTitle +
        '</div>' +

        (safeMessage
          ? '<div class="toast-msg">' +
              safeMessage +
            '</div>'
          : ''
        ) +
      '</div>' +

      '<button class="toast-close" type="button">' +
        '<i class="fa-solid fa-xmark"></i>' +
      '</button>';

    container.appendChild(toast);

    function dismissToast() {
      toast.classList.add('hide');

      setTimeout(function () {
        toast.remove();
      }, 250);
    }

    var timer = setTimeout(
      dismissToast,
      duration
    );

    var closeButton = toast.querySelector('.toast-close');

    if (closeButton) {
      closeButton.addEventListener('click', function () {
        clearTimeout(timer);
        dismissToast();
      });
    }
  }

  /* ===================== CONFIRM DELETE ===================== */

  function confirmDelete(student, callback) {
    var name = student && student.name
      ? student.name
      : 'this student';

    var confirmed = window.confirm(
      'Are you sure you want to delete ' + name + '?'
    );

    if (confirmed && typeof callback === 'function') {
      callback();
    }
  }

  /* ===================== QUEUE TOAST ===================== */

  function queueToast(type, title, message) {
    try {
      sessionStorage.setItem(
        'placementpro_pending_toast',
        JSON.stringify({
          type: type,
          title: title,
          message: message
        })
      );
    } catch (error) {
      console.error(error);
    }
  }

  function displayQueuedToast() {
    try {
      var data = sessionStorage.getItem(
        'placementpro_pending_toast'
      );

      if (!data) {
        return;
      }

      var toastData = JSON.parse(data);

      sessionStorage.removeItem(
        'placementpro_pending_toast'
      );

      setTimeout(function () {
        showToast(
          toastData.type,
          toastData.title,
          toastData.message
        );
      }, 300);

    } catch (error) {
      console.error(error);
    }
  }

  /* ===================== SIDEBAR TOGGLE ===================== */

  function initializeSidebar() {
    var sidebar = document.querySelector('.sidebar');

    var toggleButton = document.getElementById('sidebarToggle');

    if (!sidebar || !toggleButton) {
      return;
    }

    toggleButton.addEventListener('click', function () {
      sidebar.classList.toggle('sidebar-open');
      document.body.classList.toggle('sidebar-active');
    });
  }

  /* ===================== LOGOUT ===================== */

  function initializeLogout() {
    var logoutButtons = document.querySelectorAll(
      '[data-action="logout"]'
    );

    logoutButtons.forEach(function (button) {
      button.addEventListener('click', function (event) {
        event.preventDefault();

        var confirmed = window.confirm(
          'Are you sure you want to logout?'
        );

        if (!confirmed) {
          return;
        }

        try {
          sessionStorage.removeItem('pp_logged_in');
        } catch (error) {
          console.error(error);
        }

        window.location.href = 'index.html';
      });
    });
  }

  /* ===================== INITIALIZATION ===================== */

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      initializeStudents();
      initializeSidebar();
      initializeLogout();
      displayQueuedToast();
    }
  );

  /* ===================== EXPOSE GLOBAL API ===================== */

  window.PlacementPro = {
    DEMO_EMAIL: DEMO_EMAIL,
    DEMO_PASSWORD: DEMO_PASSWORD,

    getStudents: getStudents,
    saveStudents: saveStudents,
    findStudent: findStudent,

    addStudent: addStudent,
    updateStudent: updateStudent,
    deleteStudent: deleteStudent,

    generateStudentId: generateStudentId,

    escapeHtml: escapeHtml,
    debounce: debounce,

    toast: showToast,
    confirmDelete: confirmDelete,
    queueToast: queueToast
  };

  window.getStudents = getStudents;
  window.saveStudents = saveStudents;
  window.findStudent = findStudent;
  window.addStudent = addStudent;
  window.updateStudent = updateStudent;
  window.deleteStudent = deleteStudent;
  window.generateStudentId = generateStudentId;
  window.escapeHtml = escapeHtml;
  window.debounce = debounce;
  window.confirmDelete = confirmDelete;
  window.queueToast = queueToast;

  window.toast = showToast;

})();