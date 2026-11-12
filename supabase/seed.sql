-- ============================================================================
-- SYLLABUSSYNC PRODUCTION SEED SCRIPT (IDEMPOTENT)
-- ============================================================================

INSERT INTO public.universities (id, name, short_name) VALUES
('ktu', 'APJ Abdul Kalam Technological University', 'KTU')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.schemes (id, university_id, year, title) VALUES
('ktu-2019', 'ktu', 2019, '2019 Scheme')
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.subjects (id, code, name, short_name, scheme_id, semester, category, credits, lecture_hours, color, textbook, description) VALUES
('sub-cst401-ai', 'CST401', 'Artificial Intelligence', 'AI', 'ktu-2019', 'S7', 'Core', 4, 36, 'indigo', 'Stuart Russell and Peter Norvig, Artificial Intelligence: A Modern Approach (3rd edition)', 'Comprehensive study of rational agents, search techniques, adversarial search, constraint satisfaction, first-order logical reasoning, and machine learning fundamentals.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, credits = EXCLUDED.credits, lecture_hours = EXCLUDED.lecture_hours, textbook = EXCLUDED.textbook, description = EXCLUDED.description;

INSERT INTO public.subjects (id, code, name, short_name, scheme_id, semester, category, credits, lecture_hours, color, textbook, description) VALUES
('sub-ect425-bmi', 'ECT425', 'Biomedical Instrumentation', 'BMI', 'ktu-2019', 'S7', 'Open Elective', 3, 35, 'emerald', 'J. G. Webster, Medical Instrumentation: Application and Design', 'Comprehensive study of human physiological systems, bioelectric potentials, biopotential electrodes, ECG machines, cardiovascular measurements, EEG, EMG, therapeutic aids, modern imaging modalities, and electrical hospital safety.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, credits = EXCLUDED.credits, lecture_hours = EXCLUDED.lecture_hours, textbook = EXCLUDED.textbook, description = EXCLUDED.description;

INSERT INTO public.subjects (id, code, name, short_name, scheme_id, semester, category, credits, lecture_hours, color, textbook, description) VALUES
('sub-cst433-sic', 'CST433', 'Security in Computing', 'SIC', 'ktu-2019', 'S7', 'Programme Elective', 3, 35, 'violet', 'William Stallings, Cryptography and Network Security: Principles and Practice', 'Comprehensive study of computer security architecture, classical ciphers, DES, AES, public key cryptosystems (RSA, ElGamal, ECC), cryptographic hash functions, HMAC, digital signatures, key management, intrusion detection, malware, and DDoS defenses.')
ON CONFLICT (id) DO UPDATE SET
  name = EXCLUDED.name, credits = EXCLUDED.credits, lecture_hours = EXCLUDED.lecture_hours, textbook = EXCLUDED.textbook, description = EXCLUDED.description;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst401-m1', 'sub-cst401-ai', 1, 'Introduction to Artificial Intelligence', 7, 'Foundations, history, applications of AI, and structure of rational agents and environments.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t1', 'cst401-m1', NULL, 'Introduction to Artificial Intelligence', 'Core overview of artificial intelligence and artificial intelligence definitions.', 1, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t2', 'cst401-m1', NULL, 'What is Artificial Intelligence (AI)?', 'Thinking humanly, thinking rationally, acting humanly (Turing test), and acting rationally.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t3', 'cst401-m1', NULL, 'Foundations of AI', 'Contributions of philosophy, mathematics, economics, neuroscience, psychology, computer engineering, control theory, and linguistics.', 3, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t4', 'cst401-m1', NULL, 'History of Artificial Intelligence', 'Gestation of AI (1943-1955), birth of AI (Dartmouth 1956), early enthusiasm, reality checks, knowledge-based systems, AI winter, and AI resurgence.', 4, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t5', 'cst401-m1', NULL, 'Applications of Artificial Intelligence', 'Robotic vehicles, speech recognition, autonomous planning and scheduling, game playing, spam fighting, logistics planning, machine translation.', 5, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6', 'cst401-m1', NULL, 'Intelligent Agents', 'Architectural foundation of agents, rationality, environment classifications, and agent structures.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s1', 'cst401-m1', 'cst401-m1-t6', 'Agents and environments', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s2', 'cst401-m1', 'cst401-m1-t6', 'Good behaviour of agents', NULL, 2, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s3', 'cst401-m1', 'cst401-m1-t6', 'Concept of rationality', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s4', 'cst401-m1', 'cst401-m1-t6', 'Rational agents', NULL, 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s5', 'cst401-m1', 'cst401-m1-t6', 'Nature of environments (PEAS & environment properties: observable, deterministic, episodic, static, discrete, single-agent)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m1-t6-s6', 'cst401-m1', 'cst401-m1-t6', 'Structure of agents (Simple reflex, Model-based reflex, Goal-based, Utility-based, Learning agents)', NULL, 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst401-m2', 'sub-cst401-ai', 2, 'Problem Solving by Searching', 7, 'Problem-solving agents, state spaces, uninformed search strategies, informed search (heuristic algorithms), and admissible heuristics.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t1', 'cst401-m2', NULL, 'Solving problems by searching', 'Formulating problems and searching for solution paths in state space.', 1, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t2', 'cst401-m2', NULL, 'Problem-solving agents', 'Goal formulation, problem formulation, search, and execution phase.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t3', 'cst401-m2', NULL, 'Example problems', 'Toy problems (8-puzzle, 8-queens, vacuum world) and real-world problems (route finding, touring, VLSI layout, robot navigation).', 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t4', 'cst401-m2', NULL, 'Illustration of the problem-solving process by agents', 'Initial state, actions, transition model, goal test, path cost.', 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t5', 'cst401-m2', NULL, 'Searching for solutions', 'Search tree generation, node expansion, looping paths, redundant paths, graph search vs tree search.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6', 'cst401-m2', NULL, 'Uninformed search strategies', 'Classic blind search strategies with time/space complexity analysis, completeness, and optimality.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6-s1', 'cst401-m2', 'cst401-m2-t6', 'Breadth-First Search (BFS)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6-s2', 'cst401-m2', 'cst401-m2-t6', 'Uniform-Cost Search (UCS)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6-s3', 'cst401-m2', 'cst401-m2-t6', 'Depth-First Search (DFS)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6-s4', 'cst401-m2', 'cst401-m2-t6', 'Depth-Limited Search (DLS)', NULL, 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t6-s5', 'cst401-m2', 'cst401-m2-t6', 'Iterative Deepening Depth-First Search (IDDFS)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t7', 'cst401-m2', NULL, 'Informed search strategies', 'Heuristic-guided evaluation functions f(n) and optimal search.', 7, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t7-s1', 'cst401-m2', 'cst401-m2-t7', 'Best-First Search (Greedy Best-First)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t7-s2', 'cst401-m2', 'cst401-m2-t7', 'A* Search (Algorithm, optimality proof, admissibility, consistency)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m2-t8', 'cst401-m2', NULL, 'Heuristic functions', 'Effect of heuristic accuracy, generating admissible heuristics from relaxed problems, pattern databases, dominance.', 8, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst401-m3', 'sub-cst401-ai', 3, 'Search in Complex Environments', 7, 'Adversarial games, optimal game decisions, Minimax, Alpha-Beta pruning, and Constraint Satisfaction Problems (CSPs).')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t1', 'cst401-m3', NULL, 'Adversarial Search', 'Game theory and competitive environments.', 1, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t1-s1', 'cst401-m3', 'cst401-m3-t1', 'Games (Deterministic, turn-taking, zero-sum, perfect information games)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t1-s2', 'cst401-m3', 'cst401-m3-t1', 'Optimal decisions in games', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t1-s3', 'cst401-m3', 'cst401-m3-t1', 'Minimax algorithm (Tree evaluation, pseudocode, time & space complexity)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t1-s4', 'cst401-m3', 'cst401-m3-t1', 'Alpha-Beta Pruning (Mathematical conditions, pruning effectiveness, order of node visits)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2', 'cst401-m3', NULL, 'Constraint Satisfaction Problems (CSP)', 'Variables, domains, and constraints with propagation and backtracking.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2-s1', 'cst401-m3', 'cst401-m3-t2', 'Defining CSP (Variables X, Domains D, Constraints C; Map coloring, Cryptarithmetic)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2-s2', 'cst401-m3', 'cst401-m3-t2', 'Constraint propagation (Node consistency, Arc consistency AC-3, Path consistency)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2-s3', 'cst401-m3', 'cst401-m3-t2', 'Inference in CSPs (Forward checking and constraint propagation)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2-s4', 'cst401-m3', 'cst401-m3-t2', 'Backtracking search for CSPs (MRV heuristic, Degree heuristic, Least Constraining Value)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m3-t2-s5', 'cst401-m3', 'cst401-m3-t2', 'Structure of CSP problems (Independent subproblems, Tree-structured CSPs, Cutset conditioning)', NULL, 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst401-m4', 'sub-cst401-ai', 4, 'Knowledge Representation and Reasoning', 9, 'Logical agents, Propositional Logic theorem proving, First-Order Logic syntax/semantics, Unification, Forward/Backward chaining, and Resolution.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t1', 'cst401-m4', NULL, 'Logical Agents', 'Knowledge bases and reasoning principles.', 1, 'HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t1-s1', 'cst401-m4', 'cst401-m4-t1', 'Knowledge-based agents (TELL, ASK, KB architecture, Wumpus world environment)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t1-s2', 'cst401-m4', 'cst401-m4-t1', 'Logic (Syntax, semantics, entailment, model checking, inference soundness and completeness)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t2', 'cst401-m4', NULL, 'Propositional Logic', 'Boolean logic syntax, semantics, and equivalence.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t2-s1', 'cst401-m4', 'cst401-m4-t2', 'Propositional logic (Syntax, semantics, truth tables, logical equivalence)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t2-s2', 'cst401-m4', 'cst401-m4-t2', 'Propositional theorem proving (Inference rules, Modus Ponens, Resolution in PL, CNF conversion)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t2-s3', 'cst401-m4', 'cst401-m4-t2', 'Agents based on propositional logic (Finding pits and wumpus with SAT reasoning)', NULL, 3, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t3', 'cst401-m4', NULL, 'First-Order Predicate Logic (FOL)', 'Objects, relations, functions, quantifiers and knowledge engineering.', 3, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t3-s1', 'cst401-m4', 'cst401-m4-t3', 'Syntax of First-Order Logic (Constants, variables, predicates, functions, quantifiers)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t3-s2', 'cst401-m4', 'cst401-m4-t3', 'Semantics of First-Order Logic (Models, interpretations, truth values)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t3-s3', 'cst401-m4', 'cst401-m4-t3', 'Using First-Order Logic (Universal & existential assertions, nested quantifiers)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t3-s4', 'cst401-m4', 'cst401-m4-t3', 'Knowledge representation in First-Order Logic (Kinship domains, numbers, sets, lists)', NULL, 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4', 'cst401-m4', NULL, 'Inference in First-Order Logic', 'Generalized Modus Ponens, unification, chaining, and resolution refutation.', 4, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s1', 'cst401-m4', 'cst401-m4-t4', 'Propositional vs First-Order inference (Universal & Existential Instantiation, Skolemization)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s2', 'cst401-m4', 'cst401-m4-t4', 'Unification (Most General Unifier MGU algorithm)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s3', 'cst401-m4', 'cst401-m4-t4', 'Lifting (Generalized Modus Ponens GMP)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s4', 'cst401-m4', 'cst401-m4-t4', 'Forward chaining (Datalog forward chaining, efficiency issues, rete algorithm concept)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s5', 'cst401-m4', 'cst401-m4-t4', 'Backward chaining (Prolog-style logic programming, depth-first goal search)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m4-t4-s6', 'cst401-m4', 'cst401-m4-t4', 'Resolution (Converting FOL to CNF, resolution rule, proof by contradiction)', NULL, 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst401-m5', 'sub-cst401-ai', 5, 'Machine Learning', 6, 'Supervised learning concepts, Decision Tree induction (ID3/Entropy), Overfitting, Model evaluation, and Linear Models.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t1', 'cst401-m5', NULL, 'Learning from examples', 'Introduction to machine learning agent design and inductive learning hypothesis.', 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t2', 'cst401-m5', NULL, 'Forms of learning', 'Supervised, unsupervised, semi-supervised, and reinforcement learning paradigms.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t3', 'cst401-m5', NULL, 'Supervised learning', 'Function approximation, training set, test set, hypothesis space, Ockham razor.', 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t4', 'cst401-m5', NULL, 'Learning decision trees', 'Decision tree representation, entropy, information gain, ID3 algorithm walkthrough with restaurant example.', 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t5', 'cst401-m5', NULL, 'Generalization and overfitting', 'Causes of overfitting, bias-variance tradeoff, tree pruning, validation sets, k-fold cross-validation.', 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t6', 'cst401-m5', NULL, 'Evaluating and choosing the best hypothesis', 'Confusion matrix, accuracy, precision, recall, F1-score, ROC curve.', 6, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst401-m5-t7', 'cst401-m5', NULL, 'Regression and classification with linear models', 'Univariate and multivariate linear regression, gradient descent, logistic regression, sigmoid activation, decision boundaries.', 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('ect425-m1', 'sub-ect425-bmi', 1, 'Introduction to Human Physiological System', 7, 'Human physiological systems, bioelectric potentials, resting & action potential generation, and bioelectric potential recordings.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t1', 'ect425-m1', NULL, 'Physiological systems of the human body', 'Overview of cardiovascular, nervous, respiratory, and muscular systems.', 1, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t2', 'ect425-m1', NULL, 'Heart and cardiovascular system', 'Gross anatomy of heart, cardiac chambers, blood flow, cardiac cycle, and electrical conduction.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t3', 'ect425-m1', NULL, 'Anatomy of the nervous system', 'Central nervous system (CNS), peripheral nervous system (PNS), neurons, synapses, and reflex arc.', 3, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t4', 'ect425-m1', NULL, 'Physiology of the respiratory system', 'Lungs, airways, gas exchange mechanics, alveolar diffusion, and regulation of respiration.', 4, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t5', 'ect425-m1', NULL, 'Problems encountered in biomedical measurements', 'Inaccessibility of signals, low signal-to-noise ratio, variability, transducer loading effects, motion artifacts.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t6', 'ect425-m1', NULL, 'Sources of bioelectric potentials', 'Cellular ionic concentrations (Na+, K+, Cl-), semipermeable membranes, and Nernst equation.', 6, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t7', 'ect425-m1', NULL, 'Resting potential', 'Electrochemical equilibrium, Goldman-Hodgkin-Katz equation, sodium-potassium ATPase pump.', 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t8', 'ect425-m1', NULL, 'Action potential', 'Depolarization threshold, all-or-none law, repolarization, hyperpolarization, absolute & relative refractory periods.', 8, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t9', 'ect425-m1', NULL, 'Propagation of action potentials', 'Unmyelinated continuous conduction vs myelinated saltatory conduction via Nodes of Ranvier.', 9, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10', 'ect425-m1', NULL, 'Examples of bioelectric potentials', 'Diagnostic electrophysiological signals, typical amplitudes and frequency spectrum.', 10, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s1', 'ect425-m1', 'ect425-m1-t10', 'Electrocardiogram (ECG)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s2', 'ect425-m1', 'ect425-m1-t10', 'Electroencephalogram (EEG)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s3', 'ect425-m1', 'ect425-m1-t10', 'Electromyogram (EMG)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s4', 'ect425-m1', 'ect425-m1-t10', 'Electroretinogram (ERG)', NULL, 4, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s5', 'ect425-m1', 'ect425-m1-t10', 'Electrooculogram (EOG)', NULL, 5, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m1-t10-s6', 'ect425-m1', 'ect425-m1-t10', 'Electrogastrogram (EGG)', NULL, 6, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('ect425-m2', 'sub-ect425-bmi', 2, 'Biopotential Electrodes and ECG', 8, 'Electrode theory, electrode-electrolyte interface, half-cell potential, biopotential amplifiers, ECG leads, Einthoven triangle, and ECG machine architecture.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t1', 'ect425-m2', NULL, 'Biopotential electrodes', 'Electrode-electrolyte interface, charge transfer, polarizable vs non-polarizable electrodes (Ag/AgCl).', 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t2', 'ect425-m2', NULL, 'Basic theory of electrodes', 'Equivalent circuit model of electrode-skin interface, half-cell potential, motion artifact generation.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t3', 'ect425-m2', NULL, 'Microelectrodes', 'Metal microelectrodes, micropipette glass electrodes for intracellular potential measurement.', 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t4', 'ect425-m2', NULL, 'Skin surface electrodes', 'Immersion, suction cup, floating electrodes, flexible electrodes, disposable pre-gelled electrodes.', 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t5', 'ect425-m2', NULL, 'Needle electrodes', 'Subcutaneous, concentric needle, bipolar needle electrodes for localized EMG recordings.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t6', 'ect425-m2', NULL, 'Biochemical transducers', 'Reference electrodes (calomel, Ag/AgCl), pH electrode, pO2 Clark electrode, pCO2 Severinghaus electrode.', 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t7', 'ect425-m2', NULL, 'Transducers for biomedical applications', 'Displacement, pressure, temperature, photoelectric, and piezoelectric transducers in medicine.', 7, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t8', 'ect425-m2', NULL, 'Instrumentation for clinical laboratories', 'Spectrophotometers, automated biochemical analyzers, flame photometers.', 8, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t9', 'ect425-m2', NULL, 'Biopotential amplifiers', 'High CMRR, high input impedance, low-noise front-end clinical amplifiers.', 9, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t9-s1', 'ect425-m2', 'ect425-m2-t9', 'Instrumentation amplifiers (3-opamp design, CMRR derivation, gain formula)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t9-s2', 'ect425-m2', 'ect425-m2-t9', 'Isolation amplifiers (Optical, transformer-coupled, capacitive patient isolation)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t9-s3', 'ect425-m2', 'ect425-m2-t9', 'Chopper amplifiers (Low-drift modulation/demodulation for DC biomedical signals)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t10', 'ect425-m2', NULL, 'Electrical conduction system of the heart', 'Sinoatrial (SA) node, atrioventricular (AV) node, Bundle of His, bundle branches, Purkinje fibers.', 10, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t11', 'ect425-m2', NULL, 'Electrocardiograph', 'P-wave, QRS-complex, T-wave, PR interval, ST segment, QT interval clinical significance.', 11, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t12', 'ect425-m2', NULL, 'ECG electrodes and leads', 'Standard 12-lead system: bipolar limb leads (I, II, III), augmented unipolar leads (aVR, aVL, aVF), precordial chest leads (V1-V6).', 12, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t13', 'ect425-m2', NULL, 'Einthoven''s triangle', 'Einthoven law, cardiac vector hypothesis, Wilson central terminal (WCT).', 13, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t14', 'ect425-m2', NULL, 'ECG readout devices', 'Thermal array recorders, digital displays, telemetry transmission, Holter monitor recording.', 14, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m2-t15', 'ect425-m2', NULL, 'ECG machine - block diagram', 'Protection circuit, lead selector, pre-amplifier, driven right leg (DRL) circuit, bandpass filters, main amplifier, driver stage, power supply.', 15, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('ect425-m3', 'sub-ect425-bmi', 3, 'Measurement of Blood Pressure, Blood Flow and Heart Sound', 7, 'Direct and indirect blood pressure measurements, electromagnetic & ultrasonic blood flowmeters, cardiac output, plethysmography, and phonocardiography.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t1', 'ect425-m3', NULL, 'Measurement of blood pressure', 'Systolic, diastolic, mean arterial pressure (MAP), and physiology of vascular resistance.', 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t2', 'ect425-m3', NULL, 'Direct blood pressure measurement', 'Catheter-tip pressure sensors, fluid-filled catheter manometers, hydraulic dynamic response.', 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t3', 'ect425-m3', NULL, 'Indirect blood pressure measurement', 'Sphygmomanometer cuff, Korotkoff sounds (phases 1 to 5), auscultatory method.', 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t4', 'ect425-m3', NULL, 'Oscillometric measurement method', 'Automated non-invasive blood pressure (NIBP), pressure pulse oscillations, peak envelope detection.', 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t5', 'ect425-m3', NULL, 'Ultrasonic method of blood pressure measurement', 'Doppler shift detection of arterial wall motion under cuff occlusive pressure.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t6', 'ect425-m3', NULL, 'Measurement of blood flow', 'Electromagnetic blood flowmeter (Faraday''s law of induction) and Doppler ultrasound flowmeter.', 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t7', 'ect425-m3', NULL, 'Measurement of cardiac output', 'Indicator dilution method, dye dilution, thermodilution technique, Fick principle method.', 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t8', 'ect425-m3', NULL, 'Plethysmography', 'Measurement of organ/limb volume changes for peripheral vascular diagnosis.', 8, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t8-s1', 'ect425-m3', 'ect425-m3-t8', 'Photoelectric plethysmography (PPG transmission and reflection, pulse oximetry concept)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t8-s2', 'ect425-m3', 'ect425-m3-t8', 'Impedance plethysmography (Four-electrode bioimpedance, Nyboer equation, deep vein thrombosis screening)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t9', 'ect425-m3', NULL, 'Measurement of heart sounds', 'First (S1, lub) and second (S2, dub) sounds, murmurs, third and fourth sounds origin.', 9, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m3-t10', 'ect425-m3', NULL, 'Phonocardiography', 'Contact acoustic sensors, bandpass filtering, clinical PCG recording alongside ECG.', 10, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('ect425-m4', 'sub-ect425-bmi', 4, 'Measurement of EEG, EMG and Respiratory Parameters; Therapeutic Aid', 7, 'EEG recording & 10-20 system, brain wave bands, EMG & nerve conduction velocity, spirometry, pacemakers, defibrillators, ventilators, dialysis, and lithotripsy.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t1', 'ect425-m4', NULL, 'Electroencephalogram (EEG)', 'Brain electrophysiology, electrode placements, and spectral characteristics.', 1, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t1-s1', 'ect425-m4', 'ect425-m4-t1', 'Neuronal communication (Postsynaptic potentials, pyramidal cells, cortical dipole layers)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t1-s2', 'ect425-m4', 'ect425-m4-t1', 'EEG measurement (International 10-20 electrode placement system, reference points nasion & inion)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t1-s3', 'ect425-m4', 'ect425-m4-t1', 'EEG recording (Unipolar, bipolar, average montage, artifact suppression)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t1-s4', 'ect425-m4', 'ect425-m4-t1', 'EEG analysis (Delta <4Hz, Theta 4-8Hz, Alpha 8-13Hz, Beta 13-30Hz, Gamma >30Hz waveforms; epilepsy diagnosis)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t2', 'ect425-m4', NULL, 'Electromyogram (EMG)', 'Skeletal muscle motor unit action potentials and peripheral nerve testing.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t2-s1', 'ect425-m4', 'ect425-m4-t2', 'Muscle response (Motor unit action potential MUAP, recruitment, neuromuscular junction)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t2-s2', 'ect425-m4', 'ect425-m4-t2', 'Nerve conduction velocity measurements (Stimulation, latency measurement, conduction calculation v = d/(t2-t1))', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t2-s3', 'ect425-m4', 'ect425-m4-t2', 'EMG measurements (Needle EMG, surface EMG, signal amplification and audio monitoring)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t3', 'ect425-m4', NULL, 'Respiratory parameters', 'Lung volumes, capacities, and ventilatory mechanics instrumentation.', 3, 'HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t3-s1', 'ect425-m4', 'ect425-m4-t3', 'Spirometer (Water-sealed spirometer, dry rolling seal, pneumotachograph, FVC, FEV1)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t3-s2', 'ect425-m4', 'ect425-m4-t3', 'Pneumograph (Impedance pneumography, chest expansion strain gauge, thermocouple nasal airflow)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4', 'ect425-m4', NULL, 'Therapeutic aids', 'Critical medical therapeutic and life-support instrumentation.', 4, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s1', 'ect425-m4', 'ect425-m4-t4', 'Cardiac pacemakers (Pacing modes: asynchronous fixed-rate, synchronous demand, ventricular inhibited VVI)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s2', 'ect425-m4', 'ect425-m4-t4', 'Internal pacemakers (Implantable pulse generator IPG, lithium iodine battery, endocardial leads)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s3', 'ect425-m4', 'ect425-m4-t4', 'External pacemakers (Temporary transthoracic / transcutaneous pacing systems)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s4', 'ect425-m4', 'ect425-m4-t4', 'Defibrillators (AC defibrillator, DC defibrillator with Lown waveform, monophasic vs biphasic truncated exponential, AEDs)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s5', 'ect425-m4', 'ect425-m4-t4', 'Ventilators (Volume-cycled, pressure-cycled, time-cycled positive pressure mechanical ventilators)', NULL, 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s6', 'ect425-m4', 'ect425-m4-t4', 'Heart-lung machine (Extracorporeal circulation, peristaltic blood pump, membrane oxygenator, heat exchanger)', NULL, 6, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s7', 'ect425-m4', 'ect425-m4-t4', 'Hemodialysis (Artificial kidney, dialyzer semipermeable membrane, dialysate concentrate, ultrafiltration)', NULL, 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s8', 'ect425-m4', 'ect425-m4-t4', 'Lithotripsy (Extracorporeal shock-wave lithotripsy ESWL, electrohydraulic / electromagnetic / piezoelectric acoustic shock focusing for renal calculi)', NULL, 8, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m4-t4-s9', 'ect425-m4', 'ect425-m4-t4', 'Infant incubators (Thermal regulation, radiant warmers, servo-controlled humidity and oxygenation)', NULL, 9, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('ect425-m5', 'sub-ect425-bmi', 5, 'Advances in Radiological Imaging and Electrical Safety', 6, 'Diagnostic X-ray, CT scanning, MRI physics, ultrasound imaging, hospital electrical safety hazards, microshock vs macroshock, and telemedicine.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1', 'ect425-m5', NULL, 'X-rays', 'Generation, interactions, diagnostic radiography, and surgical tools.', 1, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s1', 'ect425-m5', 'ect425-m5-t1', 'Principles of X-ray generation (Coolidge tube, rotating anode, Bremsstrahlung & characteristic radiation, filtration)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s2', 'ect425-m5', 'ect425-m5-t1', 'Uses of X-rays (Skeletal, pulmonary, soft tissue radiography)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s3', 'ect425-m5', 'ect425-m5-t1', 'Diagnostic still-picture imaging (Screen-film radiography, flat-panel digital radiography)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s4', 'ect425-m5', 'ect425-m5-t1', 'Fluoroscopy (Real-time dynamic X-ray imaging, image intensifier tube optics)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s5', 'ect425-m5', 'ect425-m5-t1', 'Angiography (Radiopaque contrast agents, digital subtraction angiography DSA)', NULL, 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s6', 'ect425-m5', 'ect425-m5-t1', 'Endoscopy (Fiberoptic flexible endoscope, video endoscope, cold light illumination)', NULL, 6, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t1-s7', 'ect425-m5', 'ect425-m5-t1', 'Diathermy (Shortwave, microwave, and surgical electrosurgery cutting/coagulation units)', NULL, 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t2', 'ect425-m5', NULL, 'Computed Tomography (CT)', 'Cross-sectional volumetric reconstruction and scanner generations.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t2-s1', 'ect425-m5', 'ect425-m5-t2', 'Basic principle (Radon transform, fan beam gantry, Hounsfield units, filtered back-projection reconstruction)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t3', 'ect425-m5', NULL, 'Magnetic Resonance Imaging (MRI)', 'Nuclear magnetic resonance physics, RF excitation, and spatial encoding.', 3, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t3-s1', 'ect425-m5', 'ect425-m5-t3', 'Basic principle of MRI systems (Hydrogen proton spin precession, Larmor frequency, RF excitation, T1 longitudinal and T2 transverse relaxation, gradient magnetic coils)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t4', 'ect425-m5', NULL, 'Nuclear medicine systems', 'Gamma camera (Anger camera), scintillation crystals, collimators, PET and SPECT scanners.', 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t5', 'ect425-m5', NULL, 'Radiation therapy', 'Medical linear accelerators (LINAC), teletherapy, brachytherapy, beam collimation and treatment planning.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t6', 'ect425-m5', NULL, 'Ultrasonic imaging systems', 'Medical acoustic imaging modes and piezoelectric transducers.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t6-s1', 'ect425-m5', 'ect425-m5-t6', 'Introduction (Acoustic impedance matching, pulse-echo reflection principle, piezoelectric transducer arrays)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t6-s2', 'ect425-m5', 'ect425-m5-t6', 'Basic working principle (A-scan ophthalmic, B-scan 2D cross-section, M-scan echocardiography, Doppler colour flow mapping)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t7', 'ect425-m5', NULL, 'Electrical safety', 'Electromedical safety standards, shock prevention, and grounding systems.', 7, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t7-s1', 'ect425-m5', 'ect425-m5-t7', 'Physiological effects of electric current (Perception threshold 1mA, let-go current 10-20mA, ventricular fibrillation 100mA, burns)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t7-s2', 'ect425-m5', 'ect425-m5-t7', 'Shock hazards from electrical equipment (Macroshock cutaneous contact vs Microshock catheter cardiac contact down to 10-20 microamps, ground loop potentials, leakage currents)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t7-s3', 'ect425-m5', 'ect425-m5-t7', 'Methods of accident prevention (Chassis grounding, isolated power systems IPS with line isolation monitors LIM, ground fault circuit interrupters GFCI, isolated patient leads)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('ect425-m5-t8', 'ect425-m5', NULL, 'Introduction to telemedicine', 'Store-and-forward vs real-time telemedicine, tele-radiology, tele-cardiology, medical data security and bandwidth requirements.', 8, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst433-m1', 'sub-cst433-sic', 1, 'Basics of Security and Traditional Cryptosystems', 6, 'OSI security architecture, security services/mechanisms, symmetric cipher model, substitution and transposition ciphers.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t1', 'cst433-m1', NULL, 'OSI Security Architecture', 'ITU-T Recommendation X.800 framework for systematic security design.', 1, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t1-s1', 'cst433-m1', 'cst433-m1-t1', 'Security attacks (Passive attacks: release of message contents, traffic analysis; Active attacks: masquerade, replay, modification, denial of service)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t1-s2', 'cst433-m1', 'cst433-m1-t1', 'Security services (Authentication, access control, data confidentiality, data integrity, non-repudiation, availability)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t1-s3', 'cst433-m1', 'cst433-m1-t1', 'Security mechanisms (Encipherment, digital signature, access control, data integrity, authentication exchange, traffic padding, routing control, notarization)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t2', 'cst433-m1', NULL, 'Cryptography vs Cryptanalysis', 'Principles of making ciphers vs breaking ciphers; Kerckhoffs'' principle and Shannon''s secrecy.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t3', 'cst433-m1', NULL, 'Classical encryption techniques', 'Foundational concepts of confusion and diffusion, cryptanalytic attack models (ciphertext-only, known-plaintext, chosen-plaintext, chosen-ciphertext).', 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t4', 'cst433-m1', NULL, 'Symmetric cipher model', 'Plaintext, encryption algorithm, secret key, ciphertext, decryption algorithm, secrecy requirement.', 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5', 'cst433-m1', NULL, 'Substitution ciphers', 'Replacing letters/symbols with other letters, numbers, or symbols.', 5, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s1', 'cst433-m1', 'cst433-m1-t5', 'Monoalphabetic vs Polyalphabetic ciphers (Letter frequency analysis and polyalphabetic period detection)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s2', 'cst433-m1', 'cst433-m1-t5', 'Caesar cipher (Shift cipher modulo 26, mathematical encryption & decryption, brute-force analysis)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s3', 'cst433-m1', 'cst433-m1-t5', 'Affine cipher (Key pair (a, b) where gcd(a, 26)=1, encryption C=(aP+b) mod 26, modular inverse decryption)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s4', 'cst433-m1', 'cst433-m1-t5', 'Playfair cipher (5x5 matrix key generation, encryption rules for same row/column/rectangle, digraph security)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s5', 'cst433-m1', 'cst433-m1-t5', 'Vigenere cipher (Keyword repetition, Vigenere tableau, Kasiski method for key length discovery)', NULL, 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t5-s6', 'cst433-m1', 'cst433-m1-t5', 'Hill cipher (Linear algebra matrix multiplication modulo 26, matrix invertibility requirement det(K) coprime to 26)', NULL, 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t6', 'cst433-m1', NULL, 'Transposition ciphers', 'Permuting plaintext positions without substituting characters.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t6-s1', 'cst433-m1', 'cst433-m1-t6', 'Keyless transposition (Rail fence cipher zigzag writing and reconstruction)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t6-s2', 'cst433-m1', 'cst433-m1-t6', 'Keyed transposition (Row-column columnar transposition with numeric key order)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m1-t6-s3', 'cst433-m1', 'cst433-m1-t6', 'Double transposition (Sequential rectangular columnar transposition for resistance to frequency anagramming)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst433-m2', 'sub-cst433-sic', 2, 'Modern Symmetric Key Cryptosystems', 9, 'Feistel structure, Data Encryption Standard (DES), 3DES, Advanced Encryption Standard (AES), block cipher modes (ECB, CBC, CFB, OFB, CTR), and RC4.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t1', 'cst433-m2', NULL, 'Symmetric key ciphers', 'Shared secret model, key space size, computational security versus unconditional security.', 1, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t2', 'cst433-m2', NULL, 'Block ciphers vs Stream ciphers', 'Block processing (fixed n-bit blocks) vs continuous bit/byte keystream processing, error propagation characteristics.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t3', 'cst433-m2', NULL, 'Block cipher components', 'S-boxes (non-linear substitution), P-boxes (permutation), XOR, key mixing, round functions.', 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t4', 'cst433-m2', NULL, 'Product ciphers', 'Combining substitution, permutation, and arithmetic operations to achieve Shannon''s confusion and diffusion.', 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t5', 'cst433-m2', NULL, 'Feistel and Non-Feistel ciphers', 'Feistel network structure (left/right split, round function F, reversibility without inverting F) vs SPN substitution-permutation networks.', 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6', 'cst433-m2', NULL, 'Data Encryption Standard (DES)', '64-bit block, 56-bit key Feistel cipher with 16 rounds.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s1', 'cst433-m2', 'cst433-m2-t6', 'DES structure (Initial permutation IP, 16 Feistel rounds, 32-bit swap, inverse initial permutation IP-1)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s2', 'cst433-m2', 'cst433-m2-t6', 'Key generation (64-bit key with 8 parity bits -> PC-1 56 bits -> 16 subkeys via circular left shifts and PC-2 48 bits)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s3', 'cst433-m2', 'cst433-m2-t6', 'Design criteria (S-box non-linearity, avalanche effect, strict avalanche criterion SAC)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s4', 'cst433-m2', 'cst433-m2-t6', 'Weaknesses (56-bit short key vulnerable to brute force, weak keys, semi-weak keys, complementation property)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s5', 'cst433-m2', 'cst433-m2-t6', 'Double DES (Meet-in-the-middle attack requiring 2^57 operations, why double encryption fails to double security)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t6-s6', 'cst433-m2', 'cst433-m2-t6', 'Triple DES (3DES with two or three keys, EDE encrypt-decrypt-encrypt mode, effective 112 or 168-bit security)', NULL, 6, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t7', 'cst433-m2', NULL, 'Advanced Encryption Standard (AES)', 'Rijndael SPN cipher with 128-bit block and 128/192/256-bit keys.', 7, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t7-s1', 'cst433-m2', 'cst433-m2-t7', 'Overall structure (128-bit 4x4 state matrix, 10 rounds for 128-bit key, round architecture)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t7-s2', 'cst433-m2', 'cst433-m2-t7', 'Stages of encryption and decryption (SubBytes byte substitution in GF(2^8), ShiftRows circular shifts, MixColumns matrix multiplication in GF(2^8), AddRoundKey XOR, and inverse stages)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t7-s3', 'cst433-m2', 'cst433-m2-t7', 'Key expansion (Generating 44 32-bit words for 10 rounds, RotWord, SubWord, Rcon round constants)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8', 'cst433-m2', NULL, 'Block cipher modes of operation', 'Techniques to encrypt sequences of data blocks larger than cipher block size.', 8, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8-s1', 'cst433-m2', 'cst433-m2-t8', 'Electronic Codebook Mode (ECB) (Independent block encryption, pattern leakage flaw)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8-s2', 'cst433-m2', 'cst433-m2-t8', 'Cipher Block Chaining Mode (CBC) (IV initialization vector, XOR with previous ciphertext, error propagation)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8-s3', 'cst433-m2', 'cst433-m2-t8', 'Cipher Feedback Mode (CFB) (Converts block cipher into self-synchronizing stream cipher, shift register)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8-s4', 'cst433-m2', 'cst433-m2-t8', 'Output Feedback Mode (OFB) (Synchronous stream cipher, keystream generation, no error propagation in plaintext)', NULL, 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t8-s5', 'cst433-m2', 'cst433-m2-t8', 'Counter Mode (CTR) (Incrementing counter encryption, parallel encryption/decryption, random access)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t9', 'cst433-m2', NULL, 'Stream ciphers', 'Pseudorandom keystream generator XORed with plaintext bitwise.', 9, 'HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t9-s1', 'cst433-m2', 'cst433-m2-t9', 'Stream cipher structure (Keystream generator state, period length, randomness criteria)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m2-t9-s2', 'cst433-m2', 'cst433-m2-t9', 'RC4 algorithm (Key Scheduling Algorithm KSA for S[0..255] permutation, Pseudo-Random Generation Algorithm PRGA)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst433-m3', 'sub-cst433-sic', 3, 'Public Key Cryptosystems', 7, 'Asymmetric cryptography, RSA, ElGamal, Diffie-Hellman key exchange, and Elliptic Curve Cryptography (ECC).')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t1', 'cst433-m3', NULL, 'Introduction to public key cryptosystems', 'Asymmetric key pairs (public encryption key, private decryption key), solving symmetric key distribution.', 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t2', 'cst433-m3', NULL, 'Principles of public key cryptosystems', 'One-way trapdoor functions, mathematical hardness problems, computational infeasibility of key derivation.', 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t3', 'cst433-m3', NULL, 'Applications', 'Encryption/decryption (confidentiality), digital signatures (authenticity), and key exchange.', 3, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t4', 'cst433-m3', NULL, 'Requirements', 'Diffie and Hellman conditions for secure public-key systems.', 4, 'MEDIUM', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t5', 'cst433-m3', NULL, 'Conventional vs Public Key Cryptosystems', 'Comparison of secret key size, computational speed, key distribution scalability, and security properties.', 5, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t6', 'cst433-m3', NULL, 'RSA Cryptosystem', 'Rivest-Shamir-Adleman algorithm based on integer factorization problem.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t6-s1', 'cst433-m3', 'cst433-m3-t6', 'RSA algorithm (Prime generation p and q, modulus n=pq, Euler totient phi(n)=(p-1)(q-1), public exponent e with gcd(e, phi(n))=1, private exponent d = e^-1 mod phi(n), encryption C=M^e mod n, decryption M=C^d mod n)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t6-s2', 'cst433-m3', 'cst433-m3-t6', 'RSA security (Mathematical factoring attacks, chosen-ciphertext attacks, OAEP padding requirement)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t6-s3', 'cst433-m3', 'cst433-m3-t6', 'Attacks on RSA (Factoring n, computing phi(n), timing attacks, common modulus attacks)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t7', 'cst433-m3', NULL, 'ElGamal Cryptosystem', 'Asymmetric cipher based on Discrete Logarithm Problem (DLP).', 7, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t7-s1', 'cst433-m3', 'cst433-m3-t7', 'ElGamal algorithm (Prime q, primitive root alpha, private key XA, public key YA = alpha^XA mod q, ephemeral key k, ciphertext pair (C1, C2), decryption M = C2*(C1^XA)^-1 mod q)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t8', 'cst433-m3', NULL, 'Diffie-Hellman Key Exchange', 'Establishing shared secret over insecure communication channel.', 8, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t8-s1', 'cst433-m3', 'cst433-m3-t8', 'Algorithm (Global parameters prime q and primitive root alpha, private keys XA and XB, public values YA=alpha^XA mod q and YB=alpha^XB mod q, shared secret K = YB^XA mod q = YA^XB mod q)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t8-s2', 'cst433-m3', 'cst433-m3-t8', 'Man-in-the-middle attack (Active interception of public exchange, need for authenticated key exchange / certificates)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t9', 'cst433-m3', NULL, 'Elliptic Curve Cryptography (ECC)', 'Public key cryptography using abelian group of points on elliptic curves y^2 = x^3 + ax + b mod p.', 9, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t9-s1', 'cst433-m3', 'cst433-m3-t9', 'ElGamal ECC (Point addition, point doubling, base point G, private key n, public point P=nG, encryption and decryption)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m3-t9-s2', 'cst433-m3', 'cst433-m3-t9', 'Key exchange using ECC (ECDH Elliptic Curve Diffie-Hellman, equal security with much smaller key lengths compared to RSA)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst433-m4', 'sub-cst433-sic', 4, 'Message Integrity and Authentication', 6, 'Cryptographic hash functions, SHA-512, Message Authentication Codes (HMAC, CMAC), digital signatures (RSA, ElGamal, DSS).')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t1', 'cst433-m4', NULL, 'Hash functions', 'One-way compression functions mapping variable-length messages to fixed-length digests.', 1, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t1-s1', 'cst433-m4', 'cst433-m4-t1', 'Security requirements (Preimage resistance / one-way, Second preimage resistance / weak collision, Collision resistance / strong collision, Birthday paradox attack on n/2 bits)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t1-s2', 'cst433-m4', 'cst433-m4-t1', 'Secure Hash Algorithm (SHA-512) (Message padding to multiple of 1024 bits, 80-round compression function, 64-bit words, step architecture, round constant addition)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t2', 'cst433-m4', NULL, 'Message Authentication Code (MAC)', 'Keyed authentication tags verifying message integrity and source identity.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t2-s1', 'cst433-m4', 'cst433-m4-t2', 'Requirements (Resistance against forgery without knowledge of secret key K)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t2-s2', 'cst433-m4', 'cst433-m4-t2', 'Uses (Message integrity, sender authenticity, authentication tied to encryption)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t2-s3', 'cst433-m4', 'cst433-m4-t2', 'Hash-based MAC (HMAC) (Structure: HMAC_K(M) = H((K+ XOR opad) || H((K+ XOR ipad) || M)), security proof, design goals)', NULL, 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t2-s4', 'cst433-m4', 'cst433-m4-t2', 'Cipher-based MAC (CMAC) (NIST SP 800-38B, CBC-MAC modification with subkeys K1 and K2 for arbitrary-length messages)', NULL, 4, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3', 'cst433-m4', NULL, 'Digital signatures', 'Non-repudiable asymmetric authentication mechanisms.', 3, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s1', 'cst433-m4', 'cst433-m4-t3', 'Attacks on digital signatures (Total break, selective forgery, existential forgery)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s2', 'cst433-m4', 'cst433-m4-t3', 'Digital signature forgeries (Known-message and chosen-message attacks)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s3', 'cst433-m4', 'cst433-m4-t3', 'Requirements (Signature verification using public key, impossible to forge without private key, timestamping to prevent replay)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s4', 'cst433-m4', 'cst433-m4-t3', 'Direct digital signatures (Direct sender-to-recipient signing, vulnerability to compromised private key and validity repudiation)', NULL, 4, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s5', 'cst433-m4', 'cst433-m4-t3', 'Arbitrated digital signatures (Involving trusted arbitrator / timestamping authority TTP)', NULL, 5, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s6', 'cst433-m4', 'cst433-m4-t3', 'RSA digital signature (Signing S = M^d mod n, verification M = S^e mod n with cryptographic hash formatting)', NULL, 6, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s7', 'cst433-m4', 'cst433-m4-t3', 'ElGamal digital signature (Signing using ephemeral secret k with gcd(k, q-1)=1, signature pair (S1, S2), verification condition)', NULL, 7, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m4-t3-s8', 'cst433-m4', 'cst433-m4-t3', 'Digital Signature Standard (DSS / DSA) (FIPS PUB 186, SHA hashing with DSA algorithm, modular reduction mod p and mod q)', NULL, 8, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES
('cst433-m5', 'sub-cst433-sic', 5, 'Key Distribution and System Security', 7, 'Key management, symmetric/asymmetric key distribution, X.509 certificates, Intrusion Detection Systems (IDS), malware types & defenses, and DDoS attacks & countermeasures.')
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t1', 'cst433-m5', NULL, 'Key management', 'Key lifecycle, generation, storage, distribution, revocation, and hierarchical master/session keys.', 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t2', 'cst433-m5', NULL, 'Distribution of secret keys', 'Establishing symmetric keys securely between end entities.', 2, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t2-s1', 'cst433-m5', 'cst433-m5-t2', 'Using symmetric encryption (Key Distribution Center KDC, Needham-Schroeder protocol, Kerberos tickets)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t2-s2', 'cst433-m5', 'cst433-m5-t2', 'Using asymmetric encryption (Public-key session key distribution, nonce exchanges against replay)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t3', 'cst433-m5', NULL, 'Distribution of public keys', 'Public announcement, publicly available directory, public-key authority (PKA), and Public-Key Certificates (CA, X.509 format).', 3, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t4', 'cst433-m5', NULL, 'System security', 'Host and network defenses against unauthorized intrusion.', 4, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t4-s1', 'cst433-m5', 'cst433-m5-t4', 'Intruders (Classes: masquerader, misfeasor, clandestine user; intruder patterns)', NULL, 1, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t4-s2', 'cst433-m5', 'cst433-m5-t4', 'Intrusion detection techniques (Statistical anomaly detection, rule-based / signature-based detection, HIDS vs NIDS, honeypots)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t4-s3', 'cst433-m5', 'cst433-m5-t4', 'Password management (Password vulnerabilities, password salts, hashing with salt, password aging, proactive password checking)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t5', 'cst433-m5', NULL, 'Malicious software', 'Taxonomy of computer viruses, worms, and countermeasures.', 5, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t5-s1', 'cst433-m5', 'cst433-m5-t5', 'Viruses (Virus phases: dormant, propagation, triggering, execution; virus classification: boot sector, file infector, macro, polymorphic, metamorphic)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t5-s2', 'cst433-m5', 'cst433-m5-t5', 'Related threats (Worms, trojan horses, spyware, ransomware, keyloggers, rootkits, botnets)', NULL, 2, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t5-s3', 'cst433-m5', 'cst433-m5-t5', 'Countermeasures (First to fourth generation antivirus techniques, heuristic scanning, behavioral blocking, sandboxing)', NULL, 3, 'HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t6', 'cst433-m5', NULL, 'Distributed Denial of Service (DDoS) attacks', 'Attacking system availability through coordinated zombie botnets.', 6, 'VERY_HIGH', FALSE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t6-s1', 'cst433-m5', 'cst433-m5-t6', 'Types of DDoS attacks (Volumetric attacks: UDP/ICMP floods, amplified DNS/NTP reflection; Protocol attacks: SYN flood, Ping of Death; Application-layer attacks: HTTP GET/POST floods, Slowloris)', NULL, 1, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES
('cst433-m5-t6-s2', 'cst433-m5', 'cst433-m5-t6', 'Countermeasures (Attack prevention: filtering spoofed IP, egress filtering; Attack detection: anomaly monitoring; Attack response: rate limiting, blackholing, traffic scrubbers, Anycast routing)', NULL, 2, 'VERY_HIGH', TRUE)
ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst401-dec2022', 'sub-cst401-ai', 'December', 2022, '2019 Scheme', 'S7', 100, 3, 'KTU_CST401_AI_Dec_2022.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst401-dec2023', 'sub-cst401-ai', 'December', 2023, '2019 Scheme', 'S7', 100, 3, 'KTU_CST401_AI_Dec_2023.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst401-jan2024', 'sub-cst401-ai', 'January', 2024, '2019 Scheme', 'S7', 100, 3, 'KTU_CST401_AI_Jan_2024.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-ect425-may2023', 'sub-ect425-bmi', 'May', 2023, '2019 Scheme', 'S7', 100, 3, 'KTU_ECT425_BMI_May_2023.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-ect425-dec2023', 'sub-ect425-bmi', 'December', 2023, '2019 Scheme', 'S7', 100, 3, 'KTU_ECT425_BMI_Dec_2023.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst433-dec2022', 'sub-cst433-sic', 'December', 2022, '2019 Scheme', 'S7', 100, 3, 'KTU_CST433_SIC_Dec_2022.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst433-dec2023', 'sub-cst433-sic', 'December', 2023, '2019 Scheme', 'S7', 100, 3, 'KTU_CST433_SIC_Dec_2023.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES
('qp-cst433-jan2024', 'sub-cst433-sic', 'January', 2024, '2019 Scheme', 'S7', 100, 3, 'KTU_CST433_SIC_Jan_2024.pdf', TRUE)
ON CONFLICT (id) DO NOTHING;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-01', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m1', 'cst401-m1-t6', '1', 'A', 3, 'Define PEAS description with an example of an Automated Taxi Driver.', 'CONCEPT', 1, 'grp-peas-taxi', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-02', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m1', 'cst401-m1-t6', '11(a)', 'B', 14, 'Explain the architectural differences between Simple Reflex Agent, Model-based Reflex Agent, Goal-based Agent, and Utility-based Agent with suitable diagrams.', 'DIAGRAM', 2, 'grp-agent-structures', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-03', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m2', 'cst401-m2-t7', '13(a)', 'B', 14, 'Explain A* search algorithm in detail. Prove that A* tree search is optimal if the heuristic function h(n) is admissible.', 'ALGORITHM', 2, 'grp-astar-optimality', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-04', 'qp-cst401-dec2023', 'sub-cst401-ai', 'cst401-m2', 'cst401-m2-t6', '3', 'A', 3, 'Why is Iterative Deepening Depth-First Search (IDDFS) preferred over BFS and DFS in large search spaces?', 'CONCEPT', 1, 'grp-iddfs-advantage', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-05', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m3', 'cst401-m3-t1', '15(a)', 'B', 14, 'Illustrate Alpha-Beta pruning on a given game tree with max and min levels. Indicate which branches are pruned and why.', 'NUMERICAL', 3, 'grp-alphabeta-prune', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-06', 'qp-cst401-dec2023', 'sub-cst401-ai', 'cst401-m3', 'cst401-m3-t2', '6', 'A', 3, 'Explain the AC-3 algorithm for arc consistency in Constraint Satisfaction Problems.', 'ALGORITHM', 1, 'grp-ac3-algo', 'MEDIUM')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-07', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m4', 'cst401-m4-t4', '7', 'A', 3, 'Find the Most General Unifier (MGU) for P(A, B, B) and P(x, y, z).', 'NUMERICAL', 1, 'grp-mgu-unification', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-08', 'qp-cst401-dec2023', 'sub-cst401-ai', 'cst401-m4', 'cst401-m4-t4', '17(a)', 'B', 14, 'Convert given English statements to First-Order Logic formulas, convert to Conjunctive Normal Form (CNF), and prove the goal using Resolution Refutation.', 'LONG_ANSWER', 3, 'grp-fol-resolution', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-09', 'qp-cst401-dec2022', 'sub-cst401-ai', 'cst401-m5', 'cst401-m5-t4', '19(a)', 'B', 14, 'Explain Decision Tree Learning using ID3 algorithm. Show how Entropy and Information Gain are calculated to select the root attribute from a sample dataset.', 'ALGORITHM', 4, 'grp-id3-decision-tree', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-ai-10', 'qp-cst401-jan2024', 'sub-cst401-ai', 'cst401-m5', 'cst401-m5-t5', '10', 'A', 3, 'What is overfitting in machine learning? How does decision tree pruning prevent overfitting?', 'CONCEPT', 2, 'grp-overfitting-pruning', 'MEDIUM')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-01', 'qp-ect425-may2023', 'sub-ect425-bmi', 'ect425-m1', 'ect425-m1-t8', '1', 'A', 3, 'Differentiate between resting potential and action potential of a human cell. State the Goldman-Hodgkin-Katz equation.', 'CONCEPT', 1, 'grp-action-potential-ghk', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-02', 'qp-ect425-may2023', 'sub-ect425-bmi', 'ect425-m2', 'ect425-m2-t15', '13(a)', 'B', 14, 'Draw and explain the block diagram of an ECG recording machine. Explain the importance of Driven Right Leg (DRL) circuit.', 'DIAGRAM', 2, 'grp-ecg-machine-drl', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-03', 'qp-ect425-dec2023', 'sub-ect425-bmi', 'ect425-m2', 'ect425-m2-t9', '4', 'A', 3, 'Draw the circuit diagram of a 3-opamp instrumentation amplifier and state its CMRR advantage in biomedical acquisition.', 'DIAGRAM', 1, 'grp-inamp-biomedical', 'MEDIUM')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-04', 'qp-ect425-may2023', 'sub-ect425-bmi', 'ect425-m3', 'ect425-m3-t3', '15(a)', 'B', 14, 'Explain indirect blood pressure measurement using auscultatory Korotkoff sounds and compare it with the automated oscillometric method.', 'LONG_ANSWER', 3, 'grp-bp-measurement-methods', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-05', 'qp-ect425-may2023', 'sub-ect425-bmi', 'ect425-m4', 'ect425-m4-t4', '17(a)', 'B', 14, 'Explain the working of a DC Defibrillator with circuit diagram and Lown waveform. Differentiate between monophasic and biphasic defibrillation.', 'DIAGRAM', 3, 'grp-defibrillator-lown', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-06', 'qp-ect425-dec2023', 'sub-ect425-bmi', 'ect425-m4', 'ect425-m4-t1', '7', 'A', 3, 'Sketch the 10-20 electrode placement system used for recording EEG signals.', 'DIAGRAM', 1, 'grp-eeg-1020-system', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-07', 'qp-ect425-may2023', 'sub-ect425-bmi', 'ect425-m5', 'ect425-m5-t7', '19(a)', 'B', 14, 'Explain microshock and macroshock hazards in hospital environments. Describe how isolated power distribution systems (IPS) with Line Isolation Monitors protect patients.', 'LONG_ANSWER', 4, 'grp-electrical-safety-microshock', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-bmi-08', 'qp-ect425-dec2023', 'sub-ect425-bmi', 'ect425-m5', 'ect425-m5-t3', '10', 'A', 3, 'Explain the significance of Larmor frequency in Magnetic Resonance Imaging (MRI).', 'CONCEPT', 2, 'grp-mri-larmor', 'MEDIUM')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-01', 'qp-cst433-dec2022', 'sub-cst433-sic', 'cst433-m1', 'cst433-m1-t5', '11(a)', 'B', 14, 'Construct a Playfair cipher matrix using keyword ''MONARCHY''. Encrypt the plaintext ''BALLOON''. Explain the encryption rules for duplicate letters in a digraph and row/column wrap.', 'NUMERICAL', 2, 'grp-playfair-encrypt', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-02', 'qp-cst433-dec2023', 'sub-cst433-sic', 'cst433-m1', 'cst433-m1-t1', '1', 'A', 3, 'Differentiate between passive attacks and active attacks in OSI security architecture with examples.', 'CONCEPT', 1, 'grp-osi-attacks', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-03', 'qp-cst433-dec2022', 'sub-cst433-sic', 'cst433-m2', 'cst433-m2-t7', '13(a)', 'B', 14, 'Explain the 4 main stages (SubBytes, ShiftRows, MixColumns, AddRoundKey) of an AES round in detail. What mathematical field GF(2^8) is used?', 'ALGORITHM', 2, 'grp-aes-round-stages', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-04', 'qp-cst433-dec2023', 'sub-cst433-sic', 'cst433-m2', 'cst433-m2-t6', '4', 'A', 3, 'Explain Meet-in-the-Middle attack on Double DES. What is its effective time complexity?', 'CONCEPT', 1, 'grp-meet-in-the-middle', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-05', 'qp-cst433-jan2024', 'sub-cst433-sic', 'cst433-m2', 'cst433-m2-t8', '14(a)', 'B', 14, 'Explain Cipher Block Chaining (CBC) and Counter (CTR) modes of operation with encryption and decryption block diagrams. Highlight error propagation in each.', 'DIAGRAM', 2, 'grp-block-modes-cbc-ctr', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-06', 'qp-cst433-dec2022', 'sub-cst433-sic', 'cst433-m3', 'cst433-m3-t6', '15(a)', 'B', 14, 'In an RSA cryptosystem, given primes p=11, q=13, public key e=7, find private key d and encrypt message M=9. Then verify decryption.', 'NUMERICAL', 3, 'grp-rsa-numerical', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-07', 'qp-cst433-dec2023', 'sub-cst433-sic', 'cst433-m3', 'cst433-m3-t8', '6', 'A', 3, 'Explain how Man-in-the-Middle attack works against Diffie-Hellman Key Exchange without mutual authentication.', 'CONCEPT', 1, 'grp-dh-mitm', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-08', 'qp-cst433-dec2022', 'sub-cst433-sic', 'cst433-m4', 'cst433-m4-t2', '17(a)', 'B', 14, 'Explain the HMAC algorithm with architectural diagram. Why does HMAC execute inner and outer hashing passes?', 'DIAGRAM', 3, 'grp-hmac-architecture', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-09', 'qp-cst433-dec2023', 'sub-cst433-sic', 'cst433-m4', 'cst433-m4-t1', '7', 'A', 3, 'Explain preimage resistance, second preimage resistance, and collision resistance requirements for cryptographic hash functions.', 'CONCEPT', 1, 'grp-hash-security-props', 'HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-10', 'qp-cst433-dec2022', 'sub-cst433-sic', 'cst433-m5', 'cst433-m5-t6', '19(a)', 'B', 14, 'Describe different types of Distributed Denial of Service (DDoS) attacks (SYN flood, UDP flood, Slowloris) and explain proactive and reactive countermeasures.', 'LONG_ANSWER', 4, 'grp-ddos-attacks-mitigation', 'VERY_HIGH')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;

INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES
('pyq-sic-11', 'qp-cst433-dec2023', 'sub-cst433-sic', 'cst433-m5', 'cst433-m5-t4', '10', 'A', 3, 'Differentiate between Host-based Intrusion Detection Systems (HIDS) and Network-based Intrusion Detection Systems (NIDS).', 'CONCEPT', 2, 'grp-hids-vs-nids', 'MEDIUM')
ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;
