import { useEffect, useState } from "react";

const API = "http://localhost:3000";

export default function App() {
  const [tab, setTab] = useState("students");
  const [students, setStudents] = useState([]);
  const [books, setBooks] = useState([]);
  const [form, setForm] = useState({});
  const [editing, setEditing] = useState(null);

  
  async function loadData() {
    try {
      const [studentResponse, bookResponse] = await Promise.all([
        fetch(`${API}/students`),
        fetch(`${API}/books`)
      ]);

      if (!studentResponse.ok || !bookResponse.ok) {
        throw new Error("Failed to fetch data");
      }

      const studentData = await studentResponse.json();
      const bookData = await bookResponse.json();

      setStudents(studentData);
      setBooks(bookData);
    } catch (error) {
      console.log(error.message);
    }
  }

  useEffect(() => {
    loadData();
  }, []);

 
  const data = [...(tab === "students" ? students : books)].sort(
    (a, b) => {
      if (tab === "students") {
        return Number(a.studentId) - Number(b.studentId);
      }

      return Number(a.bookId) - Number(b.bookId);
    }
  );

 
  function addRecord() {
    setEditing(null);

    if (tab === "students") {
      setForm({
        name: "",
        course: "",
        marks: ""
      });
    } else {
      setForm({
        title: "",
        author: "",
        price: ""
      });
    }
  }

  
  function editRecord(item) {
   
    setEditing(item.id);

    setForm({
      ...item
    });
  }

  
  function getNextDisplayId() {
    const currentData =
      tab === "students" ? students : books;

    const key =
      tab === "students" ? "studentId" : "bookId";

    const ids = currentData
      .map((item) => Number(item[key]))
      .filter((id) => Number.isFinite(id));

    if (ids.length === 0) {
      return 1;
    }

    return Math.max(...ids) + 1;
  }

  
  async function saveRecord(e) {
    e.preventDefault();

    try {
      let response;

      
      if (editing !== null) {
        let payload;

        if (tab === "students") {
          payload = {
            name: form.name,
            course: form.course,
            marks: Number(form.marks)
          };
        } else {
          payload = {
            title: form.title,
            author: form.author,
            price: Number(form.price)
          };
        }

        response = await fetch(
          `${API}/${tab}/${editing}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json"
            },
            body: JSON.stringify(payload)
          }
        );
      }

     
      else {
        const displayId = getNextDisplayId();

        let payload;

        if (tab === "students") {
          payload = {
            studentId: displayId,
            name: form.name,
            course: form.course,
            marks: Number(form.marks)
          };
        } else {
          payload = {
            bookId: displayId,
            title: form.title,
            author: form.author,
            price: Number(form.price)
          };
        }

        
        response = await fetch(`${API}/${tab}`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
      }

      if (!response.ok) {
        throw new Error("Failed to save record");
      }

      setForm({});
      setEditing(null);

      await loadData();
    } catch (error) {
      console.log(error.message);
    }
  }

 
  async function deleteRecord(serverId) {
    if (
      !window.confirm(
        "Are you sure you want to delete this record?"
      )
    ) {
      return;
    }

    try {
      const response = await fetch(
        `${API}/${tab}/${serverId}`,
        {
          method: "DELETE"
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete record");
      }

      await loadData();
    } catch (error) {
      console.log(error.message);
    }
  }

  // =========================
  // CHANGE TAB
  // =========================
  function changeTab(newTab) {
    setTab(newTab);
    setForm({});
    setEditing(null);
  }

  return (
    <main>
      <h1>Students and Books</h1>

      {/* TABS */}
      <button onClick={() => changeTab("students")}>
        Students
      </button>

      <button onClick={() => changeTab("books")}>
        Books
      </button>

      <h2>
        {tab === "students" ? "Students" : "Books"}
      </h2>

      {/* ADD */}
      <button onClick={addRecord}>
        Add {tab === "students" ? "Student" : "Book"}
      </button>

      <br />
      <br />

      {/* FORM */}
      {Object.keys(form).length > 0 && (
        <form onSubmit={saveRecord}>
          {tab === "students" ? (
            <>
              <input
                type="text"
                placeholder="Name"
                required
                value={form.name || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    name: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Course"
                required
                value={form.course || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    course: e.target.value
                  })
                }
              />

              <input
                type="number"
                placeholder="Marks"
                min="0"
                max="100"
                required
                value={form.marks || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    marks: e.target.value
                  })
                }
              />
            </>
          ) : (
            <>
              <input
                type="text"
                placeholder="Title"
                required
                value={form.title || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    title: e.target.value
                  })
                }
              />

              <input
                type="text"
                placeholder="Author"
                required
                value={form.author || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    author: e.target.value
                  })
                }
              />

              <input
                type="number"
                placeholder="Price"
                min="0"
                step="0.01"
                required
                value={form.price || ""}
                onChange={(e) =>
                  setForm({
                    ...form,
                    price: e.target.value
                  })
                }
              />
            </>
          )}

          <br />
          <br />

          <button type="submit">
            {editing !== null ? "Update" : "Save"}
          </button>

          <button
            type="button"
            onClick={() => {
              setForm({});
              setEditing(null);
            }}
          >
            Cancel
          </button>
        </form>
      )}

      <br />

      {/* TABLE */}
      <table border="1" cellPadding="8">
        <thead>
          <tr>
            <th>ID</th>

            {tab === "students" ? (
              <>
                <th>Name</th>
                <th>Course</th>
                <th>Marks</th>
              </>
            ) : (
              <>
                <th>Title</th>
                <th>Author</th>
                <th>Price</th>
              </>
            )}

            <th>Actions</th>
          </tr>
        </thead>

        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              {/* DISPLAY ID */}
              <td>
                {tab === "students"
                  ? item.studentId
                  : item.bookId}
              </td>

              {tab === "students" ? (
                <>
                  <td>{item.name}</td>
                  <td>{item.course}</td>
                  <td>{item.marks}</td>
                </>
              ) : (
                <>
                  <td>{item.title}</td>
                  <td>{item.author}</td>
                  <td>{item.price}</td>
                </>
              )}

              <td>
                <button
                  type="button"
                  onClick={() => editRecord(item)}
                >
                  Edit
                </button>

                <button
                  type="button"
                  onClick={() =>
                    deleteRecord(item.id)
                  }
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}

          {data.length === 0 && (
            <tr>
              <td colSpan="5">
                No records found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </main>
  );
}