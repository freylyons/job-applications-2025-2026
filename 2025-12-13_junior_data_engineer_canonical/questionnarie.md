# Which Marketing or data related topic would you be able to give an effective presentation on? *

The implementation of functional programming concepts within data ingest and ETL/ELT processes and its implications for organisation-wide data strategy.

# Which databases or data platforms have you used in the past?

PostgreSQL, SQL Server, SQLite, REST API, Data Warehouse (end user), pandas (python), polars (nushell).

# Which software or tool for data analysis would you like to work with in the future and why?

I am primarily a python analyst. I have experience working with R, matplotlib, julia, and excel (and other languages not relevant here), but have chosen python as my toolbox of choice for a variety of reasons. It has a very mature data engineering / data science ecosystem, and acts as a robust general purpose programming language when used correctly. While lacking many desirable features like strict/static typing, and is considerably slower than other languages by default, it comes with an expressive type hinting system and certain packages like pandera make it possible to implement strict/static typing for pandas dataframes, allowing robust data preprocessing to be constructed. 

Furthermore, it comes with a lot of features that make any sort of development for an analytical project easy to implement. For starters, it supports a wide range of tooling which enables functional programming concepts to be implemented, especially in the seaborn plotting library which is designed to be used in this pattern. In plotting, FP is particularly useful because plots can take many parameters to generate, and the ability to perform partial applications and pass functions as first class citizens is an ideal way to generate many consistent plots for high-dimensional data analysis. Moreover, python comes with a mature packaging specification using pyproject.toml files, which makes it ideal for deployment across machines, teams, and in containerised environments such as docker. The implication of this is that standard libraries can be easily constructed an distributed for use within teams, allowing for incredible flexibility while also reducing repetition and technical debt.

Python also boasts an enormous ecosystem of statistical and data science libraries which are ideal for more advanced data analysis techniques, including regression analysis and clustering, as well as non-parametric machine learning such as neural-networks. Where more advanced work is needed, powerful scientific libraries such as numpy are provided which allow for custom implementations of models using low-level maths functions written in C, abstracting away some of the complexity of implementing such maths at a low level.

I am keen to continue using python for analysis and engineering due to its power, however I have also been discovering an increasing interest in Apache products such as Spark and Superset. My interest in these platforms is born from a desire to handle big data efficiently, implementing common, well-defined functions at scale (similar to the motivation for using relational databases over excel/CSVs/pandas transforms).

# What would be your 3 personal tips to maintain clean datasets?

1. Before building a data system, take the time to design robust conceptual, logical, and physical models. This must include reasoning on how the data "measure" is constructed, how it reflects the underlying data generating process, and how the model enforces/captures that in storage.
2. Make use of relational databases for structured quantitative and logical data. This enforces the constraints of the data model in a software package that implements efficient, well defined operations on the relational model in a secure fashion. Relational database systems easily handle data normalisation which is essential for the efficient maintenance of data sets and the relational model is built off propositional calculus and set theory, making it a logically sound and robust implementation for many use cases.
3. Control data ingest with functions and automations wherever possible. Manual data entry leads to an uncomfortable amount of opportunities for human error to cause significant structural problems and noise in the data that follow no discernible pattern, making it very difficult to correct in a lot of cases with no visibility of the data generating process. There are varying opinions on the strengths and weaknesses of programming paradigms, but my personal recommendation is to implement functional programming and thorough unit and integration testing throughout data pipelines, ensuring that any issues in downstream systems are isolated to problems with the data entered into the pipeline, have visible logs for auditing and debugging, and are systematic (and therefore can be corrected systematically). Manual data entry is inherent to any data system, as the data inevitably has to be generated or measured by some human source, so I view this as a system-wide minimisation problem rather than something to be eliminated, and where data entry is performed users need to be educated on best data handling practices and its philosophical underpinnings.



# What was your Bachelors university degree result, or expected result if you have not yet graduated? Please include the grading system to help us understand your result i.e. ‘85 out of 100’, ‘2:1 (Grading system: first class, 2:1, 2:2, third class)’ or ‘GPA score of 3.8/4.0 (predicted)’. We have hired outstanding individuals who did not attend or complete university. If this describes you, please continue with your application and enter ‘no degree’. 

I achieved a first class honours degree in Economics and Data Science


# How did you perform in mathematics at high school?

Top 10%

# How did you perform in your native language at high school?

Top 5%

# Please share your rationale or evidence for the high school performance selections above. Make reference to provincial, state or nation-wide scoring systems, rankings, or recognition awards, or to competitive or selective college entrance results such as SAT or ACT scores, JAMB, matriculation results, IB results etc. We recognise every system is different but we will ask you to justify your selections above.

There are two ways to quantify this: set based and grade based, in any case I am a bit of an outlier. Set based does not really apply to me since I was only in high school for half of my "high school" years, as I moved to home schooling to take advantage of my ability to learn more efficiently independently. When I was in high school I was always in the top sets for maths.

In my GCSEs I achieved a strong A grade studying independently and continued to A-level, however I did not perform so well at A-Level due to issues at home - given that was where I lived/studied this had an abnormal impact on me compared to my peers. I was able to recover this performance through a foundation year at university which removed me from that environment and enabled me to complete a very mathematics and statistics heavy degree, and I continue to pursue mathematics in my spare time for pleasure.

In English Language I was top set and achieved an A* in my GCSEs with ease.


# We require all colleagues to meet in person 2-4 times a year, at internal company events lasting between 1-2 weeks. We try to pick new and interesting locations that will likely require international travel and entry requirement visas and vaccinations. Are you willing and able to commit to this?

Yes
