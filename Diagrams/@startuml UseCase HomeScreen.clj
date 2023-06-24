@startuml UseCase HomeScreen
left to right direction

:Utilizator: --> (HomeScreen)
(HomeScreen) -up-> (NumericTriviaFact)
(NumericTriviaFact) -> (NextTriviaFact)

(HomeScreen) --> (StartQuiz)
(HomeScreen) --> (HighScore)
(HomeScreen) --> (Training)
(HomeScreen) --> (Exit)
(StartQuiz) --> (Introducere username)
(Introducere username) --> (întrebari)
(întrebari) --> (FinalScore)
(FinalScore) --> (HomeScreen)
(HighScore) --> (Punctaje)
(Training) --> (Alegere număr de întrebări)
(Alegere număr de întrebări) --> (confirmarea numărului)
(confirmarea numărului) --> (Introducere username)

(NextTriviaFact)
(NextTriviaFact) -up->(NumericTriviaFact)
(Exit) --> (yes)
(yes) --> (Deconectare din aplicație)
(Exit) --> (no)
(no) --> (HomeScreen)
@enduml