
# Create folder Structure of the php Clean Architecture DDS UI 

## For linux
```
mkdir public
mkdir src
mkdir src/Controllers
mkdir src/Http
mkdir src/Http/Middleware
mkdir src/Requests
mkdir src/Requests/User
mkdir src/Views
mkdir src/Views/layouts
mkdir src/Views/user
mkdir src/Config
```
## For Windows 10

Perfect 👍
On **Windows 10**, use **Command Prompt (CMD)** or **PowerShell**.
Below are the **correct commands** for both.

---

## ✅ Option 1: **Command Prompt (CMD)** — Recommended

Open **CMD** in your project root and run:

```cmd
mkdir public
mkdir src
mkdir src\Controllers
mkdir src\Http
mkdir src\Http\Middleware
mkdir src\Requests
mkdir src\Requests\User
mkdir src\Views
mkdir src\Views\layouts
mkdir src\Views\user
mkdir src\Config
```

---

## ✅ Option 2: **PowerShell** (also works)

```powershell
mkdir public,
      src\Controllers,
      src\Http\Middleware,
      src\Requests\User,
      src\Views\layouts,
      src\Views\user,
      src\Config
```

PowerShell automatically creates parent folders.

---

## 📂 Resulting Structure (Windows)

```text
ui-project\
├── public\
├── src\
│   ├── Controllers\
│   ├── Http\
│   │   └── Middleware\
│   ├── Requests\
│   └── User\
│   ├── Views\
│   │   ├── layouts\
│   │   └── user\
│   └── Config\
```

---

## 🔧 Optional files (CMD)

```cmd
type nul > public\index.php
type nul > src\Router.php
type nul > src\Http\ApiClient.php
type nul > src\Http\ApiResponse.php
```

---

## 🧠 Windows Tips

* Use **CMD** if you want predictable behavior
* PowerShell is fine but has slightly different syntax
* Avoid WSL unless your API runs in Linux containers

---

If you want next, I can:

* Set up **Composer autoloading**
* Add a **basic router for Windows**
* Configure **.env handling**
* Test an API call from the UI

Just tell me 👍
