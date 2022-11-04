# Mandelrot Apps
A 100% portable, 100% modular ERP engine. Created to make custom corporate apps, and designed to give you full control on your software and maximize your IT team productivity.

<br>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPGeRANkcD_aJPM-zR3WhMYh525ROJExiY__2YMWWQvJ5rkFNnRdnNCzTD43sxdAAkC3uzxACvtQD5p4yP8V3k7q3w3Mhh9mq-TfWTtK1W4VkKZ4Vt8D26_E4QUK0U3FJsrLrgAW5JIxUE0-MAKC41RVa3EjJ8Y2uRZQo3ZkfvSCnDEe0toMw6aujN/s1600/mapps1.gif" width="90%"/>
</div>
<br>

An ERP is a software synergetic ecosystem where many apps work together. If your sales team have a "Salespoint" app and your store has an "Inventory" app, when a client buys something at the shop the salesperson uses the Salespoint app and the store employee will instantly see in the Inventory app this article has -1 in stock because both of the apps share their information. An ERP solution levels up your company internal processes and therefore the business productivity.

The ERPs in the market have many advantages, but some downsides too: your company information is managed by third parties, you don't have full control of the software (it's not designed by you) so you have to adapt your processes to what the programs offer... The balance is positive but maybe not perfect.

Mandelrot Apps is not a set of corporate programs, but the engine that makes possible the environment where your corporate apps (tailor-made by your development team) will work together. With this tool, made for medium-size organizations (a few hundreds of users will be no problem, and the server will sure be able to easily handle many more) you can have all the advantages of an ERP, while keeping your information private and under control. This code is free to use and modify, so you can customize it and adapt it to your business needs at will.

But what makes this software totally different than others is its revolutionary internal arquitecture (see the explanation in the [overview document](https://github.com/mandelrot/mapps_backend/blob/master/DOCS/docs1-overview.pdf) to understand how unique it is). The concept gives it its two most unique features: modularity and portability. Maintenance, backups and migrations are as simple as copying a folder, and frontend development can be done at lightspeed.

<br>

## Main features

It has zero installations and zero external dependencies: the webserver and the database are built-in, so you just copy the package into your server, run the executable file, and the whole ERP system is on. As simple as that.

<br>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEi3a6mf5X7J8wWubtnnNtaLivpa0hE9r3lVogPdMXTxC4u9KDU9JlAqMMqHer3rhcJz2KewajLmlpNvFrnxgKddW5Y6AW9_vXfs7idHV23Cslkm150ot91aTJH6C1CrJASgLZT-GS-_-6ifxXb5ANB19qckUCP2RDYB-zBLLPos4syn7VKoWjDnlmlq/s1600/mapps2.gif" width="90%"/>
</div>
<br>

You can install/uninstall apps just by copying the apps folder to an specific engine subfolder, and they will be recognized without even restarting the server. Maintenance stops are not needed anymore.

<br>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEhIpOYq6uKIrP46TbXfc3M-7WW37bZV3jcXzJNfvN2LxJVCxNnL3k5Fa_YwpCEdKiRR3zCqk-UHuMCkGKx4N92sr-pmuZfrAA0hnYry7F8gW0gRGBzUhWqibJe8GhDi6VVL_poP7g6W0qXFtVjskF2zMbIH0BqIPQRlLv_ghvqBJhFq4TBIzjh5pcZG/s1600/mapps3.gif" width="90%"/>
</div>
<br>

And you can enable/disable the apps for your employes at will. The changes (all the information changes at any point within the apps ecosystem) will be instantly applied to every employee window. Forget about needing refreshing the page to reload data, among other inconveniences of the past.

<br>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEiPGeRANkcD_aJPM-zR3WhMYh525ROJExiY__2YMWWQvJ5rkFNnRdnNCzTD43sxdAAkC3uzxACvtQD5p4yP8V3k7q3w3Mhh9mq-TfWTtK1W4VkKZ4Vt8D26_E4QUK0U3FJsrLrgAW5JIxUE0-MAKC41RVa3EjJ8Y2uRZQo3ZkfvSCnDEe0toMw6aujN/s1600/mapps1.gif" width="90%"/>
</div>
<br>

The software has a ton of functionalities, utilities and details specially conceived to give your company an optimized workflow and all the control over your information and the tools your employees use. Internally, your IT team will love how it is designed focusing on making their job easier. And you will have all the profits of having your own apps being supported by an engine your people can easily understand, modify and customize to your needs.



<br/><br/>

<b>New in version 2:</b> ID control available from the backend (using tokens). Now the engine detects which ones of your apps can do ID validations, then the sysadmin can set one of them as default, and they can even set exceptions to that control. Your IT staff will love the way this makes their job easier and better.

<br>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEgG60twQS4EVQFyw9u11qa3UydQ69I4lwCBGvqHuOSiiQWGRgHvFupkDKsgSJ1tiOXhdRA9fFfa7X0qZJNv20YskvyD2os9M7oU7OfqCseVP5Wcjpc6U5Ru-ktvZfAZwW-s26TjrOPO4pW71sCfYKyCyCpVVQPnhjqfztvmm4i7JuL_hsovp7cX-ntq/s1600/id-readme.png" width="80%"/>
</div>

<br/><br/>

<b>New in version 3:</b> the frontent apps/modules now can be invisible to the end user, while fully functional and (with the full url) linkable themselves and their resources. This opens a whole new pattern design possible since now you can have components silently working in the background, without affecting the users experience.

<br/>
<div align="center">
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEivHjL7ktFrY5jmEdkoT0BjBFUj7USqgNUal43gzr7xkcDaL85LQZCRo-d6TPdymXzCKqjPfBqAibqvC4aRVMK7eY9a6f5B_qxB-LYb2ZZdC8ny3-7GuB4lYk1ZM0KJ9S-s4e3l6_zepGolPS1nd4jgGkeSWEn_u966f_5UoaSRXLeuBVutni2XCdBx/s1600/v3-1.png" width="80%"/>
<br/>
<img src="https://blogger.googleusercontent.com/img/b/R29vZ2xl/AVvXsEh3c6X0MWSgOplzxGBkUNXelF6zv74gYVM7hjXeZ3avfOZ8BfnU_Be46CCQxSXVovFREkwPWm0n4hZC5XlsxWIXT23xgXtEKXCdbWCF6Aqw396z7ZxocZDF5kCbvAQpb5aaELT_fkUwca0BrOFqMQEDGy2KKfMwm4Svd1Fhq6yCNldSNQzWpsyhjbIg/s1600/v3-2.png" width="80%"/>
</div>

<br/><br/><br/>

You have all the guides [in the DOCS folder](https://github.com/mandelrot/mapps_backend/tree/master/DOCS) of the code at the top of this page. Also, if you want to test a demo package with some basic apps just to show you how it works, you can download one of the two available versions of it: 

Linux: [https://mega.nz/file/7SB0kLwD#APYF_FEma2j9R5Sj6FYLC_xrKVJap4JkXNx8cTv7c78](https://mega.nz/file/7SB0kLwD#APYF_FEma2j9R5Sj6FYLC_xrKVJap4JkXNx8cTv7c78)<br>
Windows: [https://mega.nz/file/XfZgBYqb#_k2jiUqfHM6v1UgQ-qutxxnVRcO13bW13oDzMnl1n4w](https://mega.nz/file/XfZgBYqb#_k2jiUqfHM6v1UgQ-qutxxnVRcO13bW13oDzMnl1n4w)

IMPORTANT: these packages are just for demo purposes and THEY ARE NOT SECURED FOR PRODUCTION. If you want to use this software in a real corporate environment you should follow the sysadmin guide steps and generate your own custom package with your own settings and passwords. In any case, by using any of my code or software you do it fully under your own responsibility.

<br>

If you want to contact me feel free to do it:

My professional webpage: [http://josealeman.info](http://josealeman.info)<br>
My personal blog: [https://mandelrot.com](https://mandelrot.com)
