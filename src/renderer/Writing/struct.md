import \* from cognitveScienceMethods

```js
/* each of these is a list that's sorted 
@ means default if space available, else go smaller
< means lossy compression, can be auto detected many times
<< means very lossy, i.e. abbreviations, notation, icons
= means synonomous with

*/

const imports = [`import 'non-verbal IQ' from CognitiveScienceCollection`];
// how to meause possible screen sizes? guessability/lossiness
const scope = [
  `:brain: < cogfunc < cognitive function #perfered = mental function = cognitive ability = cognitive capacity = cognitive performance`, //setting: smallest dictionary word, sort by corpus freqency
  `:raven icon: < ravens = raven's = Raven's < Raven's Matrices = Raven's Progressive Matricies < ^non-verbal IQ^ < predict missing shape in a pattern of shapes + picture of trial < wiki link`,
  `cognitive controll < spatial incompatability < their description < cognitive atlas`,
  `cognitive function < ravens + spatial incompatability`,
  `x <0 $ < (finacial|income|money)`,
  `effective income < as a math equation < divide household income by the squareroot of household size`,
  `poverty|poor < their general definition < bellow median effective income`,
  `well off|rich < above median effective income`,
  `scenario prompt = explain how they would decide to solve the problem`,
  `answer scenario prompt = subjects written or voice explaination`,
  `lab = laboratory`,
  `:IndianFlag: << Indian = more specific location in india`,
  `:USFlag: << US << new jersey mall = lab setting`,
  `lab studies recruitment and testing setting = a new jersey mall = lab studies subjects = mall shopper & income range 70k median, 20k minimum & randomly assigned to condition`,
  `field study setting = Indian sugarcare farm areas`,
  `field studies recruitment = random sammple of farmers with small farms (1.5-3 acres) & 60% income from sugarcane`,
  `numeric stroop < better for low literacy`,
  `problem = scenario`,
  `harvest effect = ``(finacial|non-finacial) scenarios = describes a (finacial|non-finacial) problem the subject might face < (finacial|non-finacial) examples`,
  `easy < (easy|hard) condition = (small number|large number) in the scenarios, e.g. ($150 | $1500)`
];
```
# Claims x Audience

_all_: Poverty-related concerns consume mental resources which causes a general reduction cognitive performance.
_all expanded_ Inducing thoughts about large finacial problems reduces cognitive performance among the poor but not the well off.
The same farmer shows diminished cognitive performance before harvest, when poor, as compared with after harvest, when rich. This harvest effect cannot be explained by differences in time available, nutrition, work effort, or stress.
persistent and distracting concerns
_trying to get yourself out of poverty_ You have untapped potential which poverty is preventing you from accessing. Give yourself more time to plan and make important decisions. Chip away at things that take up your mental energy.
_interested in reducing poverty: charities, researchers_ Reduding poverty-related concerns should improve cognitive function, which should help individuals perform better at school or work, make better decisions, and break themselves out of the poverty cycle.
_interested in improving education_ Filtering applicants by non-verbal IQ will reduce oppertunities for poorer students because poverty itself can reduce cognitive performance. Poorer students will not reach their full potential, and therefore achieve the highest possible test scores, until their poverty-related concerns are addressed. Test scores at poorer schools may best be improved by provinding poverty-related services rather than traditional educational services.  
_voters, policy makers_ Providing social services for the poor should, on average, improve the recipients cognitive ability, making them more likely to pull themself out of poverty. Universal basic income, for example, could significantly improve the overall cognitive ability of the nation.
_might use some of the methods in this study_ things this study did well & limitations
_name of researchers_ use this to ping specific researchers, good when there are less than 50 researchers
_looking for a research problem to solve/inspiration_
_skeptics_
_want to replicate these findings_ full protocol docs & jupyter notebook of analysis
_reviewers_ full protocol docs & jupyter notebook of analysis

## Lab Studies

_Recruitment_
recruited shoppers from a new jersey mall
random assignment to easy or hard condition note easy/hard regex mapping problem
paid a flat fee for participation

_Design_
finacial problem = a scenario = example
non-finacial problem = a math problem = example
cognitive tests = ravens + spatial incompatability
performance bonus = .$25 per correct answer ~$7 on average

[Click for figures]
Experiment 1 = Read a finacial problem, take the cognitive tests, answer the finacial problem.
Experiment 2 = Experiment 1 with non-finacial problems
Experiment 3 = Experiment 1 with cognitive tests performance bonus
Experiment 4 = Experiment 1 but problems are answered before the cognitive tests

|experiment| 1st Task | 2nd Task | 3rd Task  
|1 | read finacial problem, cognitive tests, answer problem
|2 | read non-finacial problem, cognitive tests, answer problem
|3 | read finacial problem, \$ cognitive tests, answer problem
|4 | read finacial problem, answer problem, cognitive tests

...
Field Studies
Indian sugarcane interviewed and tested with ravens and numeric stroop twice before and after harvest over a 4 month period.

tasks - ravens - numeric
surveys - finacial pressure
holdout - 100 randomly selected subjects

Audience Mapping
knowledge, beliefs, time

assumptions about all audiences: interested in poverty and/or cognitive function

- types of readers: general public, voters, government officials
  - intro-y, zero methods, ultra high level

* anyone who thinks that... or is dealing with anyone that thinks that...
  - helping the poor will make less capable -> republicans

anyone with
