#project : Student_record_manager
#uses : accurate and efficient management of student records
#future improvements : Instead of saving the data into a txt file, it will be connected to a database and stored there instead

class Student:
    def __init__(self,name,age,roll_no):
        self.name = name
        self.age = age
        self.roll_no = roll_no

students = [] #contains all the student as objects of Student
file_path = "D:\\AI-Automation-Bootcamp\\Day 7\\student_record_manager\\students.txt"

#reads txt file and loads into students
try:
    with open(file_path, "r") as file:
        lines = file.readlines()
        for line in lines:
            name, age, roll = line.strip().split(",")
            student = Student(name,age,roll)
            students.append(student)
except FileNotFoundError:
    print("File not found")


#menu
while True:
    print("--------------------------------------------------------\n")
    print("1. Add Student")
    print("2. Display Students")
    print("3. Search Student")
    print("4. Save the Students into File")
    print("5. Exit")
    print("\n--------------------------------------------------------")
    while True:
        try:
            choice = int(input("Enter a choice : "))
            break
        except ValueError:
            print("Enter a valid numeric option from the menu")
    if choice == 5:
        break

    match choice:
        case  1:
            name = input("Enter name of the student : ")
            while True:
                try:
                    age = int(input("Enter age of the student : "))
                    roll = int(input("Enter the roll no of the student : "))
                    break
                except ValueError:
                    print("Enter a valid natural no")
            student = Student(name,age,roll)
            students.append(student)

        case 2:
            if len(students) < 1:
                print("No student in the record")
            for student in students:
                print(f"{student.name:<10}{student.age:<10}{student.roll_no}")

        case 3:
            search_name = input("Enter the name of the Student you want to search : ")
            found = False
            for student in students:
                if search_name == student.name:
                    print("-----------------------------Student Found--------------------------------\n")
                    print(f"{student.name:<10}{student.age:<10}{student.roll_no}")
                    found = True
            if found == False:
                print("Student not found")

        case 4:
            content=""
            for student in students:
                content += f"{student.name},{student.age},{student.roll_no}\n"
            try:
                with open(file_path, "w") as file:
                    file.write(content)
            except FileNotFoundError:
                print("File not found")

        case 5:
            print("Invalid Option")