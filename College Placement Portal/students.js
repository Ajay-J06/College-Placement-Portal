/* ===========================================================
   PlacementPro Admin — students.js
   Powers: students.html, add-student.html, edit-student.html,
   student-details.html, verify-student.html
   Data is mocked and persisted to localStorage (no backend).
   =========================================================== */

(function () {
  'use strict';

  var STORAGE_KEY = 'pp_students';
  var TOAST_KEY = 'pp_toast';
  var PAGE_SIZE = 8;

  /* ===================== SEED DATA ===================== */

  var FIRST_NAMES = [
    'Ananya', 'Karthik', 'Priya', 'Suresh',
    'Divya', 'Rahul', 'Meena', 'Arjun',
    'Sneha', 'Vikram', 'Lakshmi', 'Rohan',
    'Pooja', 'Aravind', 'Nisha', 'Sanjay'
  ];

  var LAST_NAMES = [
    'Reddy', 'Iyer', 'Sharma', 'Babu',
    'Krishnan', 'Rao', 'Nair', 'Menon',
    'Pillai', 'Gupta', 'Verma', 'Raman'
  ];

  var DEPTS = [
    'CSE', 'ECE', 'MECH', 'CIVIL', 'EEE', 'IT'
  ];

  var DEPT_LABELS = {
    CSE: 'Computer Science',
    ECE: 'Electronics & Comm.',
    MECH: 'Mechanical',
    CIVIL: 'Civil',
    EEE: 'Electrical',
    IT: 'Information Technology'
  };

  var YEARS = [
    '1st Year',
    '2nd Year',
    '3rd Year',
    '4th Year'
  ];

  var STATUSES = [
    'placed',
    'in-progress',
    'not-placed'
  ];

  var VERIFICATIONS = [
    'pending',
    'verified',
    'rejected'
  ];

  var SKILL_POOL = [
    'React',
    'Node.js',
    'Python',
    'Java',
    'SQL',
    'AWS',
    'Figma',
    'C++',
    'Django',
    'Machine Learning',
    'AutoCAD',
    'MATLAB'
  ];

  /* ===================== SEED STUDENTS ===================== */

  function seedStudents() {
    var list = [];

    for (var i = 1; i <= 42; i++) {
      var first =
        FIRST_NAMES[i % FIRST_NAMES.length];

      var last =
        LAST_NAMES[(i * 3) % LAST_NAMES.length];

      var dept =
        DEPTS[i % DEPTS.length];

      var year =
        YEARS[i % YEARS.length];

      var cgpa =
        (
          6 + ((i * 37) % 400) / 100
        ).toFixed(2);

      var status =
        STATUSES[i % STATUSES.length];

      var verification =
        VERIFICATIONS[i % VERIFICATIONS.length];

      var skills = [
        SKILL_POOL[
          i % SKILL_POOL.length
        ],
        SKILL_POOL[
          (i + 3) % SKILL_POOL.length
        ],
        SKILL_POOL[
          (i + 6) % SKILL_POOL.length
        ]
      ];

      list.push({
        id: 'STU' + (1000 + i),

        regNo:
          '21' +
          dept +
          String(100 + i),

        name:
          first + ' ' + last,

        dept: dept,

        year: year,

        email:
          (
            first +
            '.' +
            last +
            i
          ).toLowerCase() +
          '@college.edu',

        phone:
          '+91 9' +
          (
            800000000 + i * 7331
          ).toString().slice(0, 9),

        address:
          (100 + i) +
          ' Anna Nagar, Chennai, Tamil Nadu',

        cgpa: cgpa,

        arrears:
          i % 5 === 0 ? 1 : 0,

        skills: skills,

        photo:
          'https://i.pravatar.cc/160?img=' +
          ((i % 70) + 1),

        resumeFileName:
          first +
          '_' +
          last +
          '_Resume.pdf',

        status: status,

        verification: verification,

        remarks:
          verification === 'rejected'
            ? 'Incomplete academic documents submitted.'
            : '',

        projects: [
          {
            title:
              'Campus Placement Tracker',

            desc:
              'A full-stack app to track student placement progress and analytics.'
          },
          {
            title:
              'Smart Attendance System',

            desc:
              'Face-recognition based attendance system built for the department lab.'
          }
        ]
      });
    }

    return list;
  }

  /* ===================== STORAGE ===================== */

  function getStudents() {
    try {
      var raw =
        localStorage.getItem(
          STORAGE_KEY
        );

      if (raw) {
        return JSON.parse(raw);
      }

    } catch (e) {
      /* fall through to reseed */
    }

    var seeded =
      seedStudents();

    saveStudents(seeded);

    return seeded;
  }

  function saveStudents(list) {
    try {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(list)
      );
    } catch (e) {
      /* storage unavailable */
    }
  }

  function findStudent(id) {
    return getStudents().find(
      function (s) {
        return s.id === id;
      }
    );
  }

  function updateStudent(id, patch) {
    var list =
      getStudents();

    var idx =
      list.findIndex(
        function (s) {
          return s.id === id;
        }
      );

    if (idx === -1) {
      return null;
    }

    list[idx] =
      Object.assign(
        {},
        list[idx],
        patch
      );

    saveStudents(list);

    return list[idx];
  }

  function deleteStudent(id) {
    var list =
      getStudents().filter(
        function (s) {
          return s.id !== id;
        }
      );

    saveStudents(list);
  }

  function addStudent(student) {
    var list =
      getStudents();

    var nextNum =
      list.reduce(
        function (max, s) {
          var n =
            parseInt(
              (s.id || '')
                .replace('STU', ''),
              10
            );

          return isNaN(n)
            ? max
            : Math.max(max, n);
        },
        1000
      );

    student.id =
      'STU' + (nextNum + 1);

    list.unshift(student);

    saveStudents(list);

    return student;
  }

  function getIdFromUrl() {
    return new URLSearchParams(
      window.location.search
    ).get('id');
  }

  /* ===================== CROSS PAGE TOAST ===================== */

  function queueToast(type, title, msg) {
    try {
      sessionStorage.setItem(
        TOAST_KEY,
        JSON.stringify({
          type: type,
          title: title,
          msg: msg
        })
      );
    } catch (e) {
      /* ignore */
    }
  }

  function flushQueuedToast() {
    try {
      var raw =
        sessionStorage.getItem(
          TOAST_KEY
        );

      if (
        raw &&
        window.toast
      ) {
        var t =
          JSON.parse(raw);

        sessionStorage.removeItem(
          TOAST_KEY
        );

        setTimeout(
          function () {
            window.toast(
              t.type,
              t.title,
              t.msg
            );
          },
          400
        );
      }

    } catch (e) {
      /* ignore */
    }
  }

  /* ===================== SHARED HELPERS ===================== */

  function statusBadge(status) {
    var map = {
      placed: [
        'badge-success',
        'Placed'
      ],

      'in-progress': [
        'badge-info',
        'In Process'
      ],

      'not-placed': [
        'badge-warning',
        'Not Placed'
      ]
    };

    var m =
      map[status] ||
      [
        'badge-neutral',
        status
      ];

    return (
      '<span class="badge ' +
      m[0] +
      '">' +
      m[1] +
      '</span>'
    );
  }

  function verifyBadge(v) {
    var map = {
      pending: [
        'badge-warning',
        'Pending'
      ],

      verified: [
        'badge-success',
        'Verified'
      ],

      rejected: [
        'badge-danger',
        'Rejected'
      ]
    };

    var m =
      map[v] ||
      [
        'badge-neutral',
        v
      ];

    return (
      '<span class="badge ' +
      m[0] +
      '">' +
      m[1] +
      '</span>'
    );
  }

  function escapeHtml(str) {
    var div =
      document.createElement('div');

    div.textContent =
      str == null
        ? ''
        : String(str);

    return div.innerHTML;
  }

  document.addEventListener(
    'DOMContentLoaded',
    function () {
      flushQueuedToast();
      initStudentsListPage();
      initAddStudentPage();
      initEditStudentPage();
      initStudentDetailsPage();
      initVerifyStudentPage();
    }
  );

  /* ===========================================================
     STUDENTS LIST PAGE
     =========================================================== */

  function initStudentsListPage() {
    var tbody =
      document.getElementById(
        'studentsTableBody'
      );

    if (!tbody) return;

    var searchInput =
      document.getElementById(
        'studentSearchInput'
      );

    var deptFilter =
      document.getElementById(
        'deptFilter'
      );

    var statusFilter =
      document.getElementById(
        'statusFilter'
      );

    var countLabel =
      document.getElementById(
        'studentsCountLabel'
      );

    var paginationEl =
      document.getElementById(
        'studentsPagination'
      );

    var exportBtn =
      document.getElementById(
        'exportCsvBtn'
      );

    var sortHeaders =
      document.querySelectorAll(
        '.data-table thead th[data-sort]'
      );

    var state = {
      search: '',
      dept: '',
      status: '',
      sortKey: null,
      sortDir: 1,
      page: 1
    };

    function getFiltered() {
      var list =
        getStudents();

      var q =
        state.search
          .trim()
          .toLowerCase();

      list =
        list.filter(
          function (s) {

            var matchesQ =
              !q ||
              s.name
                .toLowerCase()
                .indexOf(q) > -1 ||
              s.regNo
                .toLowerCase()
                .indexOf(q) > -1 ||
              s.email
                .toLowerCase()
                .indexOf(q) > -1;

            var matchesDept =
              !state.dept ||
              s.dept === state.dept;

            var matchesStatus =
              !state.status ||
              s.status === state.status;

            return (
              matchesQ &&
              matchesDept &&
              matchesStatus
            );
          }
        );

      if (state.sortKey) {
        list.sort(
          function (a, b) {

            var av =
              a[state.sortKey];

            var bv =
              b[state.sortKey];

            if (
              state.sortKey === 'cgpa'
            ) {
              av =
                parseFloat(av);

              bv =
                parseFloat(bv);
            }

            if (av < bv) {
              return -1 * state.sortDir;
            }

            if (av > bv) {
              return 1 * state.sortDir;
            }

            return 0;
          }
        );
      }

      return list;
    }

    function render() {
      var filtered =
        getFiltered();

      var totalPages =
        Math.max(
          1,
          Math.ceil(
            filtered.length /
            PAGE_SIZE
          )
        );

      state.page =
        Math.min(
          state.page,
          totalPages
        );

      var pageItems =
        filtered.slice(
          (state.page - 1) *
            PAGE_SIZE,
          state.page *
            PAGE_SIZE
        );

      if (!pageItems.length) {

        tbody.innerHTML =
          '<tr>' +
          '<td colspan="6" class="table-empty">' +
          '<i class="fa-solid fa-user-graduate"></i>' +
          'No students found matching your criteria.' +
          '</td>' +
          '</tr>';

      } else {

        tbody.innerHTML =
          pageItems.map(
            function (s) {

              return (
                '<tr>' +

                '<td>' +
                escapeHtml(s.regNo) +
                '</td>' +

                '<td>' +
                '<div class="cell-user">' +

                '<img src="' +
                s.photo +
                '" alt="' +
                escapeHtml(s.name) +
                '" />' +

                '<div>' +

                '<div class="name">' +
                escapeHtml(s.name) +
                '</div>' +

                '<div class="sub">' +
                escapeHtml(s.email) +
                '</div>' +

                '</div>' +
                '</div>' +
                '</td>' +

                '<td>' +
                escapeHtml(s.dept) +
                '</td>' +

                '<td>' +
                escapeHtml(s.cgpa) +
                '</td>' +

                '<td>' +
                statusBadge(s.status) +
                '</td>' +

                '<td>' +
                '<div class="table-actions">' +

                '<a class="action-view" ' +
                'title="View" ' +
                'href="student-details.html?id=' +
                s.id +
                '">' +
                '<i class="fa-solid fa-eye"></i>' +
                '</a>' +

                '<a class="action-edit" ' +
                'title="Edit" ' +
                'href="edit-student.html?id=' +
                s.id +
                '">' +
                '<i class="fa-solid fa-pen"></i>' +
                '</a>' +

                '<button class="action-delete" ' +
                'title="Delete" ' +
                'data-delete-id="' +
                s.id +
                '">' +
                '<i class="fa-solid fa-trash"></i>' +
                '</button>' +

                '</div>' +
                '</td>' +

                '</tr>'
              );
            }
          ).join('');
      }

      if (countLabel) {

        var startN =
          filtered.length
            ? (
                state.page - 1
              ) *
                PAGE_SIZE +
                1
            : 0;

        var endN =
          Math.min(
            state.page *
              PAGE_SIZE,
            filtered.length
          );

        countLabel.textContent =
          'Showing ' +
          startN +
          '–' +
          endN +
          ' of ' +
          filtered.length +
          ' students';
      }

      renderPagination(
        totalPages
      );

      bindRowActions();
    }

    function renderPagination(
      totalPages
    ) {
      if (!paginationEl) return;

      var html = '';

      html +=
        '<button ' +
        (
          state.page === 1
            ? 'disabled'
            : ''
        ) +
        ' data-page="prev">' +
        '<i class="fa-solid fa-chevron-left"></i>' +
        '</button>';

      var pages = [];

      for (
        var p = 1;
        p <= totalPages;
        p++
      ) {

        if (
          p === 1 ||
          p === totalPages ||
          Math.abs(
            p - state.page
          ) <= 1
        ) {

          pages.push(p);

        } else if (
          pages[
            pages.length - 1
          ] !== '...'
        ) {

          pages.push('...');
        }
      }

      pages.forEach(
        function (p) {

          if (p === '...') {

            html +=
              '<span class="ellipsis">…</span>';

          } else {

            html +=
              '<button class="' +
              (
                p === state.page
                  ? 'active'
                  : ''
              ) +
              '" data-page="' +
              p +
              '">' +
              p +
              '</button>';
          }
        }
      );

      html +=
        '<button ' +
        (
          state.page === totalPages
            ? 'disabled'
            : ''
        ) +
        ' data-page="next">' +
        '<i class="fa-solid fa-chevron-right"></i>' +
        '</button>';

      paginationEl.innerHTML =
        html;

      paginationEl
        .querySelectorAll('button')
        .forEach(
          function (btn) {

            btn.addEventListener(
              'click',
              function () {

                var val =
                  btn.getAttribute(
                    'data-page'
                  );

                if (
                  val === 'prev'
                ) {

                  state.page =
                    Math.max(
                      1,
                      state.page - 1
                    );

                } else if (
                  val === 'next'
                ) {

                  state.page =
                    Math.min(
                      totalPages,
                      state.page + 1
                    );

                } else {

                  state.page =
                    parseInt(
                      val,
                      10
                    );
                }

                render();

                window.scrollTo({
                  top: 0,
                  behavior: 'smooth'
                });
              }
            );
          }
        );
    }

    function bindRowActions() {

      tbody
        .querySelectorAll(
          '[data-delete-id]'
        )
        .forEach(
          function (btn) {

            btn.addEventListener(
              'click',
              function () {

                var id =
                  btn.getAttribute(
                    'data-delete-id'
                  );

                var student =
                  findStudent(id);

                confirmDelete(
                  student,
                  function () {

                    deleteStudent(id);

                    window.toast &&
                      window.toast(
                        'success',
                        'Student removed',
                        student
                          ? student.name +
                            ' has been deleted.'
                          : 'Student deleted.'
                      );

                    render();
                  }
                );
              }
            );
          }
        );
    }

    searchInput &&
      searchInput.addEventListener(
        'input',
        debounce(
          function () {
            state.search =
              searchInput.value;

            state.page = 1;

            render();
          },
          250
        )
      );

    deptFilter &&
      deptFilter.addEventListener(
        'change',
        function () {
          state.dept =
            deptFilter.value;

          state.page = 1;

          render();
        }
      );

    statusFilter &&
      statusFilter.addEventListener(
        'change',
        function () {
          state.status =
            statusFilter.value;

          state.page = 1;

          render();
        }
      );

    sortHeaders.forEach(
      function (th) {

        th.addEventListener(
          'click',
          function () {

            var key =
              th.getAttribute(
                'data-sort'
              );

            if (
              state.sortKey === key
            ) {

              state.sortDir *= -1;

            } else {

              state.sortKey =
                key;

              state.sortDir = 1;
            }

            sortHeaders.forEach(
              function (h) {
                h.classList.remove(
                  'sorted'
                );
              }
            );

            th.classList.add(
              'sorted'
            );

            var icon =
              th.querySelector('i');

            if (icon) {

              icon.className =
                'fa-solid ' +
                (
                  state.sortDir === 1
                    ? 'fa-sort-up'
                    : 'fa-sort-down'
                );
            }

            render();
          }
        );
      }
    );

    exportBtn &&
      exportBtn.addEventListener(
        'click',
        function () {

          exportBtn.classList.add(
            'is-loading'
          );

          setTimeout(
            function () {

              exportToCsv(
                getFiltered()
              );

              exportBtn.classList.remove(
                'is-loading'
              );

              window.toast &&
                window.toast(
                  'success',
                  'Export complete',
                  'Student list downloaded as CSV.'
                );

            },
            500
          );
        }
      );

    render();
  }

  /* ===================== CSV EXPORT ===================== */

  function exportToCsv(list) {

    var headers = [
      'Register No',
      'Name',
      'Department',
      'Year',
      'Email',
      'Phone',
      'CGPA',
      'Status',
      'Verification'
    ];

    var rows =
      list.map(
        function (s) {

          return [
            s.regNo,
            s.name,
            s.dept,
            s.year,
            s.email,
            s.phone,
            s.cgpa,
            s.status,
            s.verification
          ]
            .map(
              function (v) {
                return (
                  '"' +
                  String(v)
                    .replace(
                      /"/g,
                      '""'
                    ) +
                  '"'
                );
              }
            )
            .join(',');
        }
      );

    var csv =
      headers.join(',') +
      '\n' +
      rows.join('\n');

    var blob =
      new Blob(
        [csv],
        {
          type:
            'text/csv;charset=utf-8;'
        }
      );

    var url =
      URL.createObjectURL(
        blob
      );

    var a =
      document.createElement('a');

    a.href = url;

    a.download =
      'students_export.csv';

    document.body.appendChild(a);

    a.click();

    document.body.removeChild(a);

    URL.revokeObjectURL(url);
  }

  function debounce(fn, wait) {
    var t;

    return function () {
      clearTimeout(t);

      var args =
        arguments;

      t =
        setTimeout(
          function () {
            fn.apply(
              null,
              args
            );
          },
          wait
        );
    };
  }

  /* ===========================================================
     DELETE CONFIRMATION MODAL
     =========================================================== */

  var deleteModalEl = null;

  function ensureDeleteModal() {

    if (deleteModalEl) {
      return deleteModalEl;
    }

    var wrap =
      document.createElement('div');

    wrap.className =
      'modal-overlay';

    wrap.id =
      'deleteConfirmOverlay';

    wrap.innerHTML =
      '<div class="modal-box">' +

      '<div class="modal-header">' +
      '<h3>Delete Student</h3>' +

      '<div class="modal-close" data-modal-close>' +
      '<i class="fa-solid fa-xmark"></i>' +
      '</div>' +
      '</div>' +

      '<div class="modal-body">' +

      '<div class="modal-icon-danger">' +
      '<i class="fa-solid fa-triangle-exclamation"></i>' +
      '</div>' +

      '<p id="deleteConfirmText">' +
      'Are you sure you want to delete this student? ' +
      'This action cannot be undone.' +
      '</p>' +

      '</div>' +

      '<div class="modal-footer">' +

      '<button class="btn btn-outline" ' +
      'data-modal-close>' +
      'Cancel' +
      '</button>' +

      '<button class="btn btn-danger" ' +
      'id="deleteConfirmBtn">' +
      'Delete' +
      '</button>' +

      '</div>' +
      '</div>';

    document.body.appendChild(
      wrap
    );

    wrap
      .querySelectorAll(
        '[data-modal-close]'
      )
      .forEach(
        function (b) {

          b.addEventListener(
            'click',
            function () {
              wrap.classList.remove(
                'open'
              );
            }
          );
        }
      );

    wrap.addEventListener(
      'click',
      function (e) {

        if (
          e.target === wrap
        ) {

          wrap.classList.remove(
            'open'
          );
        }
      }
    );

    deleteModalEl =
      wrap;

    return wrap;
  }

  function confirmDelete(
    student,
    onConfirm
  ) {

    var modal =
      ensureDeleteModal();

    var text =
      modal.querySelector(
        '#deleteConfirmText'
      );

    var confirmBtn =
      modal.querySelector(
        '#deleteConfirmBtn'
      );

    text.textContent =
      student
        ? 'Are you sure you want to delete "' +
          student.name +
          '"? This action cannot be undone.'
        : 'Are you sure you want to delete this student?';

    modal.classList.add(
      'open'
    );

    var newBtn =
      confirmBtn.cloneNode(
        true
      );

    confirmBtn.parentNode.replaceChild(
      newBtn,
      confirmBtn
    );

    newBtn.addEventListener(
      'click',
      function () {

        modal.classList.remove(
          'open'
        );

        onConfirm();
      }
    );
  }

  /* ===========================================================
     FORM VALIDATION
     =========================================================== */

  var EMAIL_RE =
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  var PHONE_RE =
    /^[+]?[\d\s-]{7,16}$/;

  function showFieldError(
    id,
    message
  ) {

    var input =
      document.getElementById(
        id
      );

    var err =
      document.getElementById(
        id + 'Error'
      );

    if (input) {
      input.classList.add(
        'is-invalid'
      );
    }

    if (err) {
      err.textContent =
        message;

      err.classList.add(
        'show'
      );
    }
  }

  function clearFieldError(id) {

    var input =
      document.getElementById(
        id
      );

    var err =
      document.getElementById(
        id + 'Error'
      );

    if (input) {
      input.classList.remove(
        'is-invalid'
      );
    }

    if (err) {
      err.textContent = '';

      err.classList.remove(
        'show'
      );
    }
  }

  function validateStudentForm() {

    var valid = true;

    var fields = [
      'studentName',
      'studentRegNo',
      'studentDept',
      'studentYear',
      'studentEmail',
      'studentPhone',
      'studentAddress',
      'studentCgpa'
    ];

    fields.forEach(
      clearFieldError
    );

    var name =
      document
        .getElementById(
          'studentName'
        )
        .value
        .trim();

    if (!name) {

      showFieldError(
        'studentName',
        'Full name is required.'
      );

      valid = false;
    }

    var regNo =
      document
        .getElementById(
          'studentRegNo'
        )
        .value
        .trim();

    if (!regNo) {

      showFieldError(
        'studentRegNo',
        'Register number is required.'
      );

      valid = false;
    }

    var dept =
      document
        .getElementById(
          'studentDept'
        )
        .value;

    if (!dept) {

      showFieldError(
        'studentDept',
        'Please select a department.'
      );

      valid = false;
    }

    var year =
      document
        .getElementById(
          'studentYear'
        )
        .value;

    if (!year) {

      showFieldError(
        'studentYear',
        'Please select a year.'
      );

      valid = false;
    }

    var email =
      document
        .getElementById(
          'studentEmail'
        )
        .value
        .trim();

    if (!email) {

      showFieldError(
        'studentEmail',
        'Email address is required.'
      );

      valid = false;

    } else if (
      !EMAIL_RE.test(email)
    ) {

      showFieldError(
        'studentEmail',
        'Enter a valid email address.'
      );

      valid = false;
    }

    var phone =
      document
        .getElementById(
          'studentPhone'
        )
        .value
        .trim();

    if (!phone) {

      showFieldError(
        'studentPhone',
        'Phone number is required.'
      );

      valid = false;

    } else if (
      !PHONE_RE.test(phone)
    ) {

      showFieldError(
        'studentPhone',
        'Enter a valid phone number.'
      );

      valid = false;
    }

    var address =
      document
        .getElementById(
          'studentAddress'
        )
        .value
        .trim();

    if (!address) {

      showFieldError(
        'studentAddress',
        'Address is required.'
      );

      valid = false;
    }

    var cgpaVal =
      document
        .getElementById(
          'studentCgpa'
        )
        .value;

    if (!cgpaVal) {

      showFieldError(
        'studentCgpa',
        'CGPA is required.'
      );

      valid = false;

    } else if (
      parseFloat(cgpaVal) < 0 ||
      parseFloat(cgpaVal) > 10
    ) {

      showFieldError(
        'studentCgpa',
        'CGPA must be between 0 and 10.'
      );

      valid = false;
    }

    fields.forEach(
      function (id) {

        var input =
          document.getElementById(
            id
          );

        if (input) {

          input.addEventListener(
            'input',
            function () {
              clearFieldError(id);
            },
            { once: true }
          );
        }
      }
    );

    return valid;
  }

  function readFormFields(
    existing
  ) {

    var skillsRaw =
      document
        .getElementById(
          'studentSkills'
        )
        .value
        .trim();

    return Object.assign(
      {},
      existing,
      {
        name:
          document
            .getElementById(
              'studentName'
            )
            .value
            .trim(),

        regNo:
          document
            .getElementById(
              'studentRegNo'
            )
            .value
            .trim(),

        dept:
          document
            .getElementById(
              'studentDept'
            )
            .value,

        year:
          document
            .getElementById(
              'studentYear'
            )
            .value,

        email:
          document
            .getElementById(
              'studentEmail'
            )
            .value
            .trim(),

        phone:
          document
            .getElementById(
              'studentPhone'
            )
            .value
            .trim(),

        address:
          document
            .getElementById(
              'studentAddress'
            )
            .value
            .trim(),

        cgpa:
          parseFloat(
            document
              .getElementById(
                'studentCgpa'
              )
              .value
          ).toFixed(2),

        arrears:
          parseInt(
            document
              .getElementById(
                'studentArrears'
              )
              .value ||
              '0',
            10
          ),

        skills:
          skillsRaw
            ? skillsRaw
                .split(',')
                .map(
                  function (s) {
                    return s.trim();
                  }
                )
                .filter(Boolean)
            : []
      }
    );
  }

  /* ===========================================================
     PHOTO / RESUME UPLOAD
     =========================================================== */

  function initUploadZones(
    state
  ) {

    var photoInput =
      document.getElementById(
        'photoInput'
      );

    var photoDropZone =
      document.getElementById(
        'photoDropZone'
      );

    var photoPreviewImg =
      document.getElementById(
        'photoPreviewImg'
      );

    var photoPlaceholderIcon =
      document.getElementById(
        'photoPlaceholderIcon'
      );

    function setPhoto(dataUrl) {

      state.photo =
        dataUrl;

      if (
        photoPreviewImg
      ) {

        photoPreviewImg.src =
          dataUrl;

        photoPreviewImg.style.display =
          'block';
      }

      if (
        photoPlaceholderIcon
      ) {

        photoPlaceholderIcon.style.display =
          'none';
      }
    }

    if (photoInput) {

      photoInput.addEventListener(
        'change',
        function () {

          var file =
            photoInput.files[0];

          if (!file) return;

          if (
            !file.type.startsWith(
              'image/'
            )
          ) {

            window.toast &&
              window.toast(
                'error',
                'Invalid file',
                'Please upload a JPG or PNG image.'
              );

            return;
          }

          if (
            file.size >
            2 * 1024 * 1024
          ) {

            window.toast &&
              window.toast(
                'error',
                'File too large',
                'Photo must be under 2MB.'
              );

            return;
          }

          var reader =
            new FileReader();

          reader.onload =
            function (e) {
              setPhoto(
                e.target.result
              );
            };

          reader.readAsDataURL(
            file
          );
        }
      );
    }

    if (photoDropZone) {

      [
        'dragover',
        'dragenter'
      ].forEach(
        function (evt) {

          photoDropZone.addEventListener(
            evt,
            function (e) {

              e.preventDefault();

              photoDropZone.classList.add(
                'drag-over'
              );
            }
          );
        }
      );

      [
        'dragleave',
        'drop'
      ].forEach(
        function (evt) {

          photoDropZone.addEventListener(
            evt,
            function (e) {

              e.preventDefault();

              photoDropZone.classList.remove(
                'drag-over'
              );
            }
          );
        }
      );

      photoDropZone.addEventListener(
        'drop',
        function (e) {

          var file =
            e.dataTransfer.files[0];

          if (
            file &&
            photoInput
          ) {

            var dt =
              new DataTransfer();

            dt.items.add(
              file
            );

            photoInput.files =
              dt.files;

            photoInput.dispatchEvent(
              new Event(
                'change'
              )
            );
          }
        }
      );
    }

    var resumeInput =
      document.getElementById(
        'resumeInput'
      );

    var resumeDropZone =
      document.getElementById(
        'resumeDropZone'
      );

    var resumeFileNameDisplay =
      document.getElementById(
        'resumeFileNameDisplay'
      );

    function setResume(name) {

      state.resumeFileName =
        name;

      if (
        resumeFileNameDisplay
      ) {

        resumeFileNameDisplay.textContent =
          name;

        resumeFileNameDisplay.style.display =
          'inline-flex';
      }
    }

    if (resumeDropZone) {

      resumeDropZone.addEventListener(
        'click',
        function () {

          resumeInput &&
            resumeInput.click();
        }
      );
    }

    if (resumeInput) {

      resumeInput.addEventListener(
        'change',
        function () {

          var file =
            resumeInput.files[0];

          if (!file) return;

          if (
            file.size >
            5 * 1024 * 1024
          ) {

            window.toast &&
              window.toast(
                'error',
                'File too large',
                'Resume must be under 5MB.'
              );

            return;
          }

          setResume(
            file.name
          );
        }
      );
    }

    if (resumeDropZone) {

      [
        'dragover',
        'dragenter'
      ].forEach(
        function (evt) {

          resumeDropZone.addEventListener(
            evt,
            function (e) {

              e.preventDefault();

              resumeDropZone.classList.add(
                'drag-over'
              );
            }
          );
        }
      );

      [
        'dragleave',
        'drop'
      ].forEach(
        function (evt) {

          resumeDropZone.addEventListener(
            evt,
            function (e) {

              e.preventDefault();

              resumeDropZone.classList.remove(
                'drag-over'
              );
            }
          );
        }
      );

      resumeDropZone.addEventListener(
        'drop',
        function (e) {

          var file =
            e.dataTransfer.files[0];

          if (
            file &&
            resumeInput
          ) {

            var dt =
              new DataTransfer();

            dt.items.add(
              file
            );

            resumeInput.files =
              dt.files;

            resumeInput.dispatchEvent(
              new Event(
                'change'
              )
            );
          }
        }
      );
    }

    return {
      setPhoto: setPhoto,
      setResume: setResume
    };
  }

  /* ===========================================================
     ADD STUDENT PAGE
     =========================================================== */

  function initAddStudentPage() {

    var form =
      document.getElementById(
        'addStudentForm'
      );

    if (!form) return;

    var uploadState = {
      photo:
        'https://i.pravatar.cc/160?img=68',

      resumeFileName:
        ''
    };

    initUploadZones(
      uploadState
    );

    var resetBtn =
      document.getElementById(
        'resetFormBtn'
      );

    if (resetBtn) {

      resetBtn.addEventListener(
        'click',
        function () {

          form.reset();

          document
            .querySelectorAll(
              '.form-error.show'
            )
            .forEach(
              function (e) {
                e.classList.remove(
                  'show'
                );
              }
            );

          document
            .querySelectorAll(
              '.is-invalid'
            )
            .forEach(
              function (e) {
                e.classList.remove(
                  'is-invalid'
                );
              }
            );
        }
      );
    }

    form.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();

        if (
          !validateStudentForm()
        ) {

          window.toast &&
            window.toast(
              'error',
              'Missing information',
              'Please fix the highlighted fields.'
            );

          return;
        }

        var submitBtn =
          document.getElementById(
            'addSubmitBtn'
          );

        submitBtn.classList.add(
          'is-loading'
        );

        submitBtn.disabled =
          true;

        var newStudent =
          readFormFields({
            photo:
              uploadState.photo,

            resumeFileName:
              uploadState.resumeFileName ||
              'resume.pdf',

            status:
              'not-placed',

            verification:
              'pending',

            remarks:
              '',

            projects:
              []
          });

        setTimeout(
          function () {

            addStudent(
              newStudent
            );

            queueToast(
              'success',
              'Student added',
              newStudent.name +
              ' has been registered successfully.'
            );

            window.location.href =
              'students.html';

          },
          700
        );
      }
    );
  }

  /* ===========================================================
     EDIT STUDENT PAGE
     =========================================================== */

  function initEditStudentPage() {

    var form =
      document.getElementById(
        'editStudentForm'
      );

    if (!form) return;

    var id =
      getIdFromUrl();

    var student =
      id
        ? findStudent(id)
        : null;

    if (!student) {

      window.toast &&
        window.toast(
          'error',
          'Student not found',
          'Redirecting back to the student list.'
        );

      setTimeout(
        function () {
          window.location.href =
            'students.html';
        },
        900
      );

      return;
    }

    document.getElementById(
      'studentName'
    ).value =
      student.name;

    document.getElementById(
      'studentRegNo'
    ).value =
      student.regNo;

    document.getElementById(
      'studentDept'
    ).value =
      student.dept;

    document.getElementById(
      'studentYear'
    ).value =
      student.year;

    document.getElementById(
      'studentEmail'
    ).value =
      student.email;

    document.getElementById(
      'studentPhone'
    ).value =
      student.phone;

    document.getElementById(
      'studentAddress'
    ).value =
      student.address;

    document.getElementById(
      'studentCgpa'
    ).value =
      student.cgpa;

    document.getElementById(
      'studentArrears'
    ).value =
      student.arrears;

    document.getElementById(
      'studentSkills'
    ).value =
      (
        student.skills || []
      ).join(', ');

    var uploadState = {
      photo:
        student.photo,

      resumeFileName:
        student.resumeFileName
    };

    var setters =
      initUploadZones(
        uploadState
      );

    if (
      setters.setPhoto &&
      student.photo
    ) {

      setters.setPhoto(
        student.photo
      );
    }

    if (
      setters.setResume &&
      student.resumeFileName
    ) {

      setters.setResume(
        student.resumeFileName
      );
    }

    var cancelBtn =
      document.getElementById(
        'cancelEditBtn'
      );

    if (cancelBtn) {

      cancelBtn.addEventListener(
        'click',
        function () {

          window.location.href =
            'student-details.html?id=' +
            student.id;
        }
      );
    }

    form.addEventListener(
      'submit',
      function (e) {

        e.preventDefault();

        if (
          !validateStudentForm()
        ) {

          window.toast &&
            window.toast(
              'error',
              'Missing information',
              'Please fix the highlighted fields.'
            );

          return;
        }

        var submitBtn =
          document.getElementById(
            'updateSubmitBtn'
          );

        submitBtn.classList.add(
          'is-loading'
        );

        submitBtn.disabled =
          true;

        var updated =
          readFormFields({
            photo:
              uploadState.photo,

            resumeFileName:
              uploadState.resumeFileName
          });

        setTimeout(
          function () {

            updateStudent(
              student.id,
              updated
            );

            queueToast(
              'success',
              'Student updated',
              updated.name +
              '’s profile has been saved.'
            );

            window.location.href =
              'student-details.html?id=' +
              student.id;

          },
          700
        );
      }
    );
  }

  /* ===========================================================
     STUDENT DETAILS PAGE
     =========================================================== */

  function initStudentDetailsPage() {

    var root =
      document.getElementById(
        'studentDetailsRoot'
      );

    if (!root) return;

    var id =
      getIdFromUrl();

    var student =
      id
        ? findStudent(id)
        : null;

    if (!student) {

      root.innerHTML =
        '<div class="card">' +
        '<div class="card-body table-empty">' +
        '<i class="fa-solid fa-user-xmark"></i>' +
        'Student not found.' +
        '<br><br>' +
        '<a href="students.html" ' +
        'class="btn btn-primary">' +
        'Back to Students' +
        '</a>' +
        '</div>' +
        '</div>';

      return;
    }

    document.getElementById(
      'breadcrumbStudentName'
    ).textContent =
      student.name;

    document.getElementById(
      'profilePhoto'
    ).src =
      student.photo;

    document.getElementById(
      'profileName'
    ).textContent =
      student.name;

    document.getElementById(
      'profileRegNo'
    ).textContent =
      student.regNo;

    document.getElementById(
      'profileEmail'
    ).textContent =
      student.email;

    document.getElementById(
      'profilePhone'
    ).textContent =
      student.phone;

    document.getElementById(
      'profileCgpa'
    ).textContent =
      student.cgpa;

    document.getElementById(
      'profileStatusBadge'
    ).innerHTML =
      statusBadge(
        student.status
      );

    document.getElementById(
      'profileVerifyBadge'
    ).innerHTML =
      verifyBadge(
        student.verification
      );

    document.getElementById(
      'editStudentLink'
    ).href =
      'edit-student.html?id=' +
      student.id;

    document.getElementById(
      'fieldRegNo'
    ).textContent =
      student.regNo;

    document.getElementById(
      'fieldEmail'
    ).textContent =
      student.email;

    document.getElementById(
      'fieldPhone'
    ).textContent =
      student.phone;

    document.getElementById(
      'fieldAddress'
    ).textContent =
      student.address;

    document.getElementById(
      'fieldDept'
    ).textContent =
      DEPT_LABELS[
        student.dept
      ] ||
      student.dept;

    document.getElementById(
      'fieldYear'
    ).textContent =
      student.year;

    document.getElementById(
      'fieldCgpa'
    ).textContent =
      student.cgpa;

    document.getElementById(
      'fieldArrears'
    ).textContent =
      student.arrears;

    document
      .querySelectorAll(
        '.edit-field-btn'
      )
      .forEach(
        function (btn) {

          btn.addEventListener(
            'click',
            function () {

              window.location.href =
                'edit-student.html?id=' +
                student.id;
            }
          );

          btn.style.cursor =
            'pointer';
        }
      );

    var skillsWrap =
      document.getElementById(
        'skillsWrap'
      );

    skillsWrap.innerHTML =
      (
        student.skills || []
      )
        .map(
          function (s) {

            return (
              '<span class="skill-tag">' +
              escapeHtml(s) +
              '</span>'
            );
          }
        )
        .join('') ||

      '<span class="text-muted" ' +
      'style="font-size:13px;">' +
      'No skills listed.' +
      '</span>';

    var projectsWrap =
      document.getElementById(
        'projectsWrap'
      );

    projectsWrap.innerHTML =
      (
        student.projects || []
      )
        .map(
          function (p) {

            return (
              '<div class="project-item">' +
              '<h4>' +
              escapeHtml(
                p.title
              ) +
              '</h4>' +

              '<p>' +
              escapeHtml(
                p.desc
              ) +
              '</p>' +

              '</div>'
            );
          }
        )
        .join('') ||

      '<p class="text-muted" ' +
      'style="font-size:13px;">' +
      'No projects added.' +
      '</p>';

    document.getElementById(
      'resumeFileName'
    ).textContent =
      student.resumeFileName;

    document.getElementById(
      'downloadResumeBtn'
    ).addEventListener(
      'click',
      function () {

        window.toast &&
          window.toast(
            'info',
            'Download started',
            student.resumeFileName +
            ' is downloading…'
          );
      }
    );

    var eligibilityBox =
      document.getElementById(
        'eligibilityBox'
      );

    var cgpaOk =
      parseFloat(
        student.cgpa
      ) >= 6.5;

    var arrearsOk =
      student.arrears === 0;

    var verifiedOk =
      student.verification ===
      'verified';

    eligibilityBox.innerHTML =
      [
        [
          'Minimum CGPA (6.5+)',
          cgpaOk
        ],
        [
          'No standing arrears',
          arrearsOk
        ],
        [
          'Profile verified',
          verifiedOk
        ]
      ]
        .map(
          function (row) {

            var ok =
              row[1];

            return (
              '<div class="eligibility-item">' +

              '<span>' +

              '<i class="fa-solid ' +

              (
                ok
                  ? 'fa-circle-check eligibility-ok'
                  : 'fa-circle-xmark eligibility-fail'
              ) +

              '"></i>' +

              row[0] +

              '</span>' +

              '<span class="' +

              (
                ok
                  ? 'eligibility-ok'
                  : 'eligibility-fail'
              ) +

              '">' +

              (
                ok
                  ? 'Met'
                  : 'Not met'
              ) +

              '</span>' +

              '</div>'
            );
          }
        )
        .join('');

    document.getElementById(
      'deleteStudentBtn'
    ).addEventListener(
      'click',
      function () {

        confirmDelete(
          student,
          function () {

            deleteStudent(
              student.id
            );

            queueToast(
              'success',
              'Student removed',
              student.name +
              ' has been deleted.'
            );

            window.location.href =
              'students.html';
          }
        );
      }
    );
  }

  /* ===========================================================
     VERIFY STUDENTS PAGE
     =========================================================== */

  function initVerifyStudentPage() {

    var tbody =
      document.getElementById(
        'verifyTableBody'
      );

    if (!tbody) return;

    var countPending =
      document.getElementById(
        'countPending'
      );

    var countVerified =
      document.getElementById(
        'countVerified'
      );

    var countRejected =
      document.getElementById(
        'countRejected'
      );

    var countTotal =
      document.getElementById(
        'countTotal'
      );

    var tabButtons =
      document.querySelectorAll(
        '.verify-tab-btn'
      );

    var remarksOverlay =
      document.getElementById(
        'remarksModalOverlay'
      );

    var remarksTitle =
      document.getElementById(
        'remarksModalTitle'
      );

    var remarksTextarea =
      document.getElementById(
        'remarksTextarea'
      );

    var remarksSubmitBtn =
      document.getElementById(
        'remarksSubmitBtn'
      );

    var currentTab =
      'pending';

    var pendingAction =
      null;

    function updateCounts() {

      var all =
        getStudents();

      if (countTotal) {
        countTotal.textContent =
          all.length;
      }

      if (countPending) {
        countPending.textContent =
          all.filter(
            function (s) {
              return (
                s.verification ===
                'pending'
              );
            }
          ).length;
      }

      if (countVerified) {
        countVerified.textContent =
          all.filter(
            function (s) {
              return (
                s.verification ===
                'verified'
              );
            }
          ).length;
      }

      if (countRejected) {
        countRejected.textContent =
          all.filter(
            function (s) {
              return (
                s.verification ===
                'rejected'
              );
            }
          ).length;
      }
    }

    function render() {

      var list =
        getStudents().filter(
          function (s) {

            return (
              s.verification ===
              currentTab
            );
          }
        );

      if (!list.length) {

        tbody.innerHTML =
          '<tr>' +
          '<td colspan="6" ' +
          'class="table-empty">' +
          '<i class="fa-solid fa-user-check"></i>' +
          'No students in this category.' +
          '</td>' +
          '</tr>';

      } else {

        tbody.innerHTML =
          list.map(
            function (s) {

              var actions = '';

              if (
                currentTab ===
                'pending'
              ) {

                actions =
                  '<button class="action-approve" ' +
                  'title="Approve" ' +
                  'data-decide="' +
                  s.id +
                  '|verified">' +

                  '<i class="fa-solid fa-check"></i>' +
                  '</button>' +

                  '<button class="action-reject" ' +
                  'title="Reject" ' +
                  'data-decide="' +
                  s.id +
                  '|rejected">' +

                  '<i class="fa-solid fa-xmark"></i>' +
                  '</button>';

              } else if (
                currentTab ===
                'verified'
              ) {

                actions =
                  '<button class="action-reject" ' +
                  'title="Move to Rejected" ' +
                  'data-decide="' +
                  s.id +
                  '|rejected">' +

                  '<i class="fa-solid fa-xmark"></i>' +
                  '</button>';

              } else {

                actions =
                  '<button class="action-approve" ' +
                  'title="Move to Verified" ' +
                  'data-decide="' +
                  s.id +
                  '|verified">' +

                  '<i class="fa-solid fa-check"></i>' +
                  '</button>';
              }

              actions +=
                '<a class="action-view" ' +
                'title="View" ' +
                'href="student-details.html?id=' +
                s.id +
                '">' +

                '<i class="fa-solid fa-eye"></i>' +
                '</a>';

              return (
                '<tr>' +

                '<td>' +
                '<div class="cell-user">' +

                '<img src="' +
                s.photo +
                '" alt="' +
                escapeHtml(s.name) +
                '" />' +

                '<div>' +

                '<div class="name">' +
                escapeHtml(s.name) +
                '</div>' +

                '<div class="sub">' +
                escapeHtml(s.regNo) +
                '</div>' +

                '</div>' +
                '</div>' +
                '</td>' +

                '<td>' +
                escapeHtml(
                  s.resumeFileName
                ) +
                '</td>' +

                '<td>' +
                escapeHtml(
                  s.cgpa
                ) +
                '</td>' +

                '<td>' +

                (
                  parseFloat(
                    s.cgpa
                  ) >= 6.5 &&
                  s.arrears === 0

                    ? '<span class="badge badge-success">' +
                      'Eligible' +
                      '</span>'

                    : '<span class="badge badge-warning">' +
                      'Review' +
                      '</span>'
                ) +

                '</td>' +

                '<td>' +
                verifyBadge(
                  s.verification
                ) +
                '</td>' +

                '<td>' +
                '<div class="table-actions">' +
                actions +
                '</div>' +
                '</td>' +

                '</tr>'
              );
            }
          ).join('');
      }

      updateCounts();

      bindDecideButtons();
    }

    function bindDecideButtons() {

      tbody
        .querySelectorAll(
          '[data-decide]'
        )
        .forEach(
          function (btn) {

            btn.addEventListener(
              'click',
              function () {

                var parts =
                  btn
                    .getAttribute(
                      'data-decide'
                    )
                    .split('|');

                pendingAction = {
                  studentId:
                    parts[0],

                  decision:
                    parts[1]
                };

                var student =
                  findStudent(
                    pendingAction.studentId
                  );

                remarksTitle.textContent =
                  (
                    pendingAction.decision ===
                    'verified'

                      ? 'Verify'
                      : 'Reject'
                  ) +

                  ' Student' +

                  (
                    student
                      ? ' — ' +
                        student.name
                      : ''
                  );

                remarksTextarea.value =
                  student &&
                  student.remarks

                    ? student.remarks
                    : '';

                remarksOverlay.classList.add(
                  'open'
                );
              }
            );
          }
        );
    }

    if (remarksSubmitBtn) {

      remarksSubmitBtn.addEventListener(
        'click',
        function () {

          if (
            !pendingAction
          ) {

            remarksOverlay.classList.remove(
              'open'
            );

            return;
          }

          var student =
            updateStudent(
              pendingAction.studentId,
              {
                verification:
                  pendingAction.decision,

                remarks:
                  remarksTextarea
                    .value
                    .trim()
              }
            );

          remarksOverlay.classList.remove(
            'open'
          );

          if (student) {

            window.toast &&
              window.toast(
                pendingAction.decision ===
                'verified'

                  ? 'success'
                  : 'warning',

                pendingAction.decision ===
                'verified'

                  ? 'Student verified'
                  : 'Student rejected',

                student.name +
                ' has been ' +

                (
                  pendingAction.decision ===
                  'verified'

                    ? 'verified'
                    : 'rejected'
                ) +
                '.'
              );
          }

          pendingAction =
            null;

          render();
        }
      );
    }

    tabButtons.forEach(
      function (btn) {

        btn.addEventListener(
          'click',
          function () {

            currentTab =
              btn.getAttribute(
                'data-tab'
              );

            render();
          }
        );
      }
    );

    render();
  }

})();