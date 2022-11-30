function domID(id) {
  return document.getElementById(id);
}

var employeeList = [];
var mode = "create";

function submitForm() {
  if (mode === "create") createEmployee();
  else if (mode === "update") updateEmployee();
}

function createEmployee() {
  mode = "create";

  var arrNotify = document.getElementsByClassName("sp-thongbao");
  for (var i = 0; i < arrNotify.length; i++) {
    arrNotify[i].classList.add("visibleNotify");
  }
  //VALID
  if (!checkValid()) return;

  var account = domID("tknv").value;
  var fullName = domID("name").value;
  var email = domID("email").value;
  var pass = domID("password").value;
  var date = domID("datepicker").value;
  var salary = domID("luongCB").value * 1;
  var position = domID("chucvu").value;
  var hourWork = domID("gioLam").value * 1;

  //2. check id
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].account === account) {
      alert("Tai khoan da ton tai");
      return;
    }
  }
  //Create obj Employee
  var employee = new Employee(
    account,
    fullName,
    email,
    pass,
    date,
    salary,
    position,
    hourWork
  );

  employeeList.push(employee);

  renderEmployees();

  saveEmployeeList();

  domID("form").reset();
}

function renderEmployees(data) {
  if (!data) data = employeeList;
  var html = "";
  for (var i = 0; i < data.length; i++) {
    html += `<tr>
        <td>${data[i].account}</td>
        <td>${data[i].fullName}</td>
        <td>${data[i].email}</td>
        <td>${data[i].date}</td>
        <td>${data[i].position}</td>
        <td>${data[i].total()}</td>
        <td>${data[i].type()}</td>
        <td>
          <button onclick="getUpdateEmployee('${
            data[i].account
          }')" data-toggle="modal" data-target="#myModal" data-backdrop="static" class="btn btn-warning">Sửa</button>
          <button class="btn btn-danger" onclick="deleteEmployee('${
            data[i].account
          }')">Xoá</button>
        </td>
        
      </tr> \n`;
  }
  domID("tableDanhSach").innerHTML = html;
}

function saveEmployeeList() {
  var employeeListJson = JSON.stringify(employeeList);
  localStorage.setItem("SL", employeeListJson);
}
function getEmployeeList() {
  var employeeListJson = localStorage.getItem("SL");
  if (!employeeListJson) return [];
  return JSON.parse(employeeListJson);
}
function mapEmployeeList(local) {
  var result = [];
  for (var i = 0; i < local.length; i++) {
    var oldEmployee = local[i];

    var newEmployee = new Employee(
      oldEmployee.account,
      oldEmployee.fullName,
      oldEmployee.email,
      oldEmployee.pass,
      oldEmployee.date,
      oldEmployee.salary,
      oldEmployee.position,
      oldEmployee.hourWork
    );
    result.push(newEmployee);
  }
  return result;
}

function findById(id) {
  for (var i = 0; i < employeeList.length; i++) {
    if (employeeList[i].account === id) {
      return i;
    }
  }
  return -1;
}

function deleteEmployee(id) {
  var index = findById(id);
  if (index === -1) {
    return alert("Account khong ton tai");
  }
  employeeList.splice(index, 1);
  renderEmployees();
  saveEmployeeList();
}

// FIX
function btnFix() {
  mode = "update";
  var title = domID("header-title");
  title.innerHTML = "Update Info";
  console.log(title);
}
function getUpdateEmployee(id) {
  domID("header-title").innerHTML = "Fix Info";

  var index = findById(id);
  if (index === -1) {
    return alert("Account khong ton tai");
  }

  var employee = employeeList[index];

  domID("tknv").value = employee.account;
  domID("name").value = employee.fullName;
  domID("email").value = employee.email;
  domID("password").value = employee.pass;
  domID("datepicker").value = employee.date;
  domID("luongCB").value = employee.salary;
  domID("chucvu").value = employee.position;
  domID("gioLam").value = employee.hourWork;

  // disable input account
  domID("tknv").disabled = true;

  var btnUpdate = domID("btnCapNhat");
  var btnAdd = domID("btnThemNV");

  btnUpdate.style.display = "block";
  btnAdd.style.display = "none";
}

function updateEmployee() {
  var arrNotify = document.getElementsByClassName("sp-thongbao");
  for (var i = 0; i < arrNotify.length; i++) {
    arrNotify[i].classList.add("visibleNotify");
  }

  if (!checkValid()) domID('btnCapNhat').removeAttribute('data-dismiss', 'modal');
  else

  var account = domID("tknv").value;
  var fullName = domID("name").value;
  var email = domID("email").value;
  var pass = domID("password").value;
  var date = domID("datepicker").value;
  var salary = domID("luongCB").value * 1;
  var position = domID("chucvu").value;
  var hourWork = domID("gioLam").value * 1;

  var index = findById(account);
  var employee = employeeList[index];
  employee.fullName = fullName;
  employee.email = email;
  employee.pass = pass;
  employee.date = date;
  employee.position = position;
  employee.hourWork = hourWork;
  employee.salary = salary;

  mode = "create";

  renderEmployees();
  saveEmployeeList();
  
  domID("tknv").disabled = false;

  //set data-dismiss: modal for btnCapNhat
  // console.log(checkValid);
 
    domID('btnCapNhat').setAttribute('data-dismiss', 'modal');
    cancelUpdate();
  
}

function cancelUpdate() {
  domID("form").reset();
}

// SEARCH
function searchEmployee(e) {
  var keyword = e.target.value.toLowerCase().trim();

  var result = [];

  for (var i = 0; i < employeeList.length; i++) {
    var employeeType = employeeList[i].type().toLowerCase();
    if (employeeType.includes(keyword)) {
      result.push(employeeList[i]);
    }
  }

  renderEmployees(result);
  console.log(result);
}

window.onload = function () {
  var employeeListFromLocal = getEmployeeList();
  employeeList = mapEmployeeList(employeeListFromLocal);
  renderEmployees();
};

//VALIDATION
//required

function required(val, config) {
  if (val.length > 0) {
    domID(config.errorId).innerHTML = "";
    return true;
  } else {
    domID(config.errorId).innerHTML = "Vui lòng nhập giá trị";
    return false;
  }
}

function requiredPosition() {
  var valueInput = domID("chucvu");
  var notify = domID("tbChucVu");

  if (valueInput.selectedIndex === 0) {
    notify.innerHTML = "Vui lòng chọn chức vụ";
    return false;
  } else {
    notify.innerHTML = "";
    return true;
  }
}
//pattern
function pattern(val, config) {
  if (config.regexp.test(val)) {
    domID(config.errorId).innerHTML = "";
    return true;
  } else {
    domID(config.errorId).innerHTML = config.main;
    return false;
  }
}

function checkValueInput(idFideld, config) {
  var valueInput = domID(idFideld).value * 1;
  if (valueInput < config.min || valueInput > config.max) {
    domID(config.errorId).innerHTML = config.main;
    console.log(valueInput);
    return false;
  } else {
    domID(config.errorId).innerHTML = "";
    return true;
  }
}

function validRequiredForm(idFideld, idNotify) {
  var valueInput = domID(idFideld).value;

  var localCheck = required(valueInput, { errorId: idNotify });

  return localCheck;
}

function checkValid() {
  var accountRegexp = /(^[0-9]{4,6}$)+/g;
  var fullNameRegexp = /^[A-z\s]+$/g;
  var emailFormat = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/g;
  var passRegexp =
    /^(?=.*[a-z]*)(?=.*[A-Z]+)(?=.*[0-9]+)(?=.*[!@#\$%\^&\*]+).{6,10}$/g;
  var salaryRegexp = /(^[0-9]{7,8}$)+/g;
  var hourWorkRegexp = /(^[0-9]{2,3}$)+/g;
  var dateRegexp = /(^(0[1-9]|1[0-2])(\/)(0[1-9]|[12]\d|3[01])(\/)[12]\d{3})$/g;

  var validAccount =
    validRequiredForm("tknv", "tbTKNV") &&
    pattern(domID("tknv").value, {
      errorId: "tbTKNV",
      regexp: accountRegexp,
      main: "Tài khoản phải từ 4 - 6 kí tự số",
    });

  var validFullName =
    validRequiredForm("name", "tbTen") &&
    pattern(domID("name").value, {
      errorId: "tbTen",
      regexp: fullNameRegexp,
      main: "Tên nhân viên phải là chữ",
    });

  var validEmail =
    validRequiredForm("email", "tbEmail") &&
    pattern(domID("email").value, {
      errorId: "tbEmail",
      regexp: emailFormat,
      main: "Email chưa đúng định dạng",
    });
  var validPass =
    validRequiredForm("password", "tbMatKhau") &&
    pattern(domID("password").value, {
      errorId: "tbMatKhau",
      regexp: passRegexp,
      main: "Mật Khẩu từ 6-10 ký tự (chứa ít nhất 1 ký tự số, 1 ký tự in hoa, 1 ký tự đặc biệt)",
    });
  var validDate =
    validRequiredForm("datepicker", "tbNgay") &&
    pattern(domID("datepicker").value, {
      errorId: "tbNgay",
      regexp: dateRegexp,
      main: "Ngày chưa đúng định dạng mm/dd/yyyy",
    });
  var validSalary =
    validRequiredForm("luongCB", "tbLuongCB") &&
    pattern(domID("luongCB").value, {
      errorId: "tbLuongCB",
      regexp: salaryRegexp,
      main: "Lương phải là số, giá trị từ 1 000 000 - 20 000 000",
    }) &&
    checkValueInput("luongCB", {
      errorId: "tbLuongCB",
      min: 1000000,
      max: 20000000,
      main: "Lương phải là số, giá trị từ 1 000 000 - 20 000 000",
    });
  var validHourWord =
    validRequiredForm("gioLam", "tbGiolam") &&
    pattern(domID("gioLam").value, {
      errorId: "tbGiolam",
      regexp: hourWorkRegexp,
      main: "Giờ làm phải là số, giá trị từ 80 - 200 giờ",
    }) &&
    checkValueInput("gioLam", {
      errorId: "tbGiolam",
      min: 80,
      max: 200,
      main: "Giờ làm phải là số, giá trị từ 80 - 200 giờ",
    });
  var position = requiredPosition();

  var valid =
    validAccount &&
    validFullName &&
    validEmail &&
    validPass &&
    position &&
    validDate &&
    validSalary &&
    validHourWord;
  return valid;
}

domID("btnDong").addEventListener("click", function () {
  domID("form").reset();
  domID("tknv").disabled = false;
  var arrNotify = document.getElementsByClassName("sp-thongbao");
  for (var i = 0; i < arrNotify.length; i++) {
    arrNotify[i].classList.remove("visibleNotify");
  }
});

domID("btnThem").addEventListener("click", function () {
  var btnUpdate = domID("btnCapNhat");
  var btnAdd = domID("btnThemNV");

  btnUpdate.style.display = "none";
  btnAdd.style.display = "block";

  domID("header-title").innerHTML = "Log In";
  domID("btnThem").setAttribute("data-backdrop", "static");
});


