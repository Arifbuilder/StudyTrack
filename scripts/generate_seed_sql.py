import json

with open('src/data/officialSyllabus.json', encoding='utf-8') as f:
    syl = json.load(f)

with open('src/data/officialPYQs.json', encoding='utf-8') as f:
    pyq = json.load(f)

lines = []
lines.append("-- ============================================================================")
lines.append("-- SYLLABUSSYNC PRODUCTION SEED SCRIPT (IDEMPOTENT)")
lines.append("-- ============================================================================\n")

# University
lines.append("INSERT INTO public.universities (id, name, short_name) VALUES")
lines.append("('ktu', 'APJ Abdul Kalam Technological University', 'KTU')")
lines.append("ON CONFLICT (id) DO NOTHING;\n")

# Scheme
lines.append("INSERT INTO public.schemes (id, university_id, year, title) VALUES")
lines.append("('ktu-2019', 'ktu', 2019, '2019 Scheme')")
lines.append("ON CONFLICT (id) DO NOTHING;\n")

# Subjects
for s in syl['subjects']:
    desc = s['description'].replace("'", "''")
    tb = s['textbook'].replace("'", "''")
    name = s['name'].replace("'", "''")
    lines.append(f"INSERT INTO public.subjects (id, code, name, short_name, scheme_id, semester, category, credits, lecture_hours, color, textbook, description) VALUES")
    lines.append(f"('{s['id']}', '{s['code']}', '{name}', '{s['shortName']}', 'ktu-2019', 'S7', '{s['category']}', {s['credits']}, {s['lectureHours']}, '{s['color']}', '{tb}', '{desc}')")
    lines.append("ON CONFLICT (id) DO UPDATE SET")
    lines.append(f"  name = EXCLUDED.name, credits = EXCLUDED.credits, lecture_hours = EXCLUDED.lecture_hours, textbook = EXCLUDED.textbook, description = EXCLUDED.description;\n")

# Modules & Topics
for s in syl['subjects']:
    for m in s['modules']:
        m_title = m['title'].replace("'", "''")
        m_desc = m['description'].replace("'", "''")
        lines.append(f"INSERT INTO public.modules (id, subject_id, module_number, title, lecture_hours, description) VALUES")
        lines.append(f"('{m['id']}', '{s['id']}', {m['moduleNumber']}, '{m_title}', {m['lectureHours']}, '{m_desc}')")
        lines.append("ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, lecture_hours = EXCLUDED.lecture_hours, description = EXCLUDED.description;\n")
        
        for t in m['topics']:
            t_title = t['title'].replace("'", "''")
            t_desc = t['description'].replace("'", "''")
            is_leaf = len(t['subtopics']) == 0
            lines.append(f"INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES")
            lines.append(f"('{t['id']}', '{m['id']}', NULL, '{t_title}', '{t_desc}', {t['order']}, '{t['priority']}', {str(is_leaf).upper()})")
            lines.append("ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;\n")
            
            for st in t['subtopics']:
                st_title = st['title'].replace("'", "''")
                lines.append(f"INSERT INTO public.topics (id, module_id, parent_topic_id, title, description, display_order, priority, is_leaf) VALUES")
                lines.append(f"('{st['id']}', '{m['id']}', '{t['id']}', '{st_title}', NULL, {st['order']}, '{st['priority']}', TRUE)")
                lines.append("ON CONFLICT (id) DO UPDATE SET title = EXCLUDED.title, priority = EXCLUDED.priority, is_leaf = EXCLUDED.is_leaf;\n")

# Question Papers
for p in pyq['papers']:
    lines.append(f"INSERT INTO public.question_papers (id, subject_id, month, year, scheme, semester, total_marks, duration_hours, filename, verified) VALUES")
    lines.append(f"('{p['id']}', '{p['subjectId']}', '{p['month']}', {p['year']}, '{p['scheme']}', '{p['semester']}', {p['totalMarks']}, {p['durationHours']}, '{p['filename']}', TRUE)")
    lines.append("ON CONFLICT (id) DO NOTHING;\n")

# PYQ Questions
for q in pyq['questions']:
    q_text = q['questionText'].replace("'", "''")
    top_id = f"'{q['topicId']}'" if q.get('topicId') else "NULL"
    lines.append(f"INSERT INTO public.pyq_questions (id, paper_id, subject_id, module_id, topic_id, q_number, part, marks, question_text, question_type, page_number, group_id, priority) VALUES")
    lines.append(f"('{q['id']}', '{q['paperId']}', '{q['subjectId']}', '{q['moduleId']}', {top_id}, '{q['qNumber']}', '{q['part']}', {q['marks']}, '{q_text}', '{q['questionType']}', {q['pageNumber']}, '{q.get('groupId', '')}', '{q['priority']}')")
    lines.append("ON CONFLICT (id) DO UPDATE SET question_text = EXCLUDED.question_text, marks = EXCLUDED.marks, priority = EXCLUDED.priority;\n")

with open('supabase/seed.sql', 'w', encoding='utf-8') as f:
    f.write('\n'.join(lines))

print("Successfully generated supabase/seed.sql!")
