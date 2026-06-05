# 🌍 WorldScope — Country Explorer

A dynamic country explorer web app built with vanilla JavaScript that fetches and displays data for every nation in the world using the REST Countries API.

> ** Dynamic Content with JavaScript**

---

## 🔗 Live Demo

[areej0345.github.io/Dynamic-Content](https://areej0345.github.io/Dynamic-Content/)

---

## ✨ Features

- 🌐 Fetches real-time country data from the [REST Countries API](https://restcountries.com)
- 🔍 Search functionality to filter countries by name
- 📊 Displays key info — population, region, and more
- ➕ "Load more" pagination to browse all nations
- ❌ Graceful error handling when API is unreachable
- 📱 Responsive design — works on mobile and desktop

---

## 🛠️ Tech Stack

| Technology | Usage |
|------------|-------|
| HTML5 | Page structure |
| CSS3 | Styling & responsive layout |
| JavaScript (Vanilla) | DOM manipulation, API calls, dynamic rendering |
| REST Countries API | Country data source |
| GitHub Pages | Deployment |

---

## 📁 Project Structure

```
Dynamic-Content/
├── index.html       # Main HTML file
├── style.css        # Stylesheet
└── script.js        # JavaScript — API fetch & dynamic content logic
```

---

## 🚀 Getting Started

### Run Locally

```bash
git clone https://github.com/areej0345/Dynamic-Content.git
cd Dynamic-Content
```

Then open `index.html` in your browser — no build step needed.

---

## 📡 API Reference

Data is sourced from the **REST Countries API**:

```
GET https://restcountries.com/v3.1/all
```

Returns an array of country objects with fields like `name`, `population`, `region`, `flags`, and more.

---


## 📄 License

This project is open source and available under the [MIT License](LICENSE).
