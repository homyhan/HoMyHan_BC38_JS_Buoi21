function Employee(account, fullName, email, pass, date, salary, position, hourWork) {
    this.account = account;
    this.fullName = fullName;
    this.email = email;
    this.pass = pass;
    this.date = date;
    this.salary =salary;
    this.position = position;
    this.hourWork = hourWork;

    this.total = function (){
        if(this.position==='Sếp'){
            return this.salary * 3;
        }else if(this.position==='Trưởng phòng'){
            return this.salary * 2;
        }else if(this.position==='Nhân viên'){
            return this.salary;
        }
    };
    this.type= function(){
        if(this.hourWork>=192){
            return "Xuất sắc";
        }else if(this.hourWork>=176 && this.hourWork<192){
            return "Giỏi";
        }else if(this.hourWork>=160 && this.hourWork<176){
            return "Khá";
        }else{
            return "Trung bình";
        }
    };

    
}