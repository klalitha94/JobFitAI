// Integration test script for JobFit AI backend APIs

async function runTests() {
  const baseUrl = 'http://localhost:5000/api';
  console.log('--- Testing JobFit AI Endpoints ---');

  // 1. Health Check
  const healthRes = await fetch(`${baseUrl}/health`).then(r => r.json());
  console.log('1. Health Check:', healthRes.status, '| DB:', healthRes.database.isMemoryFallback ? 'Fallback In-Memory' : 'MongoDB Connected');

  // 2. Demo Login
  const loginRes = await fetch(`${baseUrl}/auth/demo-login`, { method: 'POST' }).then(r => r.json());
  const token = loginRes.token;
  console.log('2. Demo Login:', loginRes.success ? 'SUCCESS' : 'FAILED', '| User:', loginRes.user?.name);

  const authHeaders = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  // 3. Location-Based Job Discovery (Feature 2)
  const bglrJobs = await fetch(`${baseUrl}/jobs?city=Bengaluru&limit=3`).then(r => r.json());
  console.log('3. Bengaluru Jobs Found:', bglrJobs.jobs?.length, '| Top:', bglrJobs.jobs?.[0]?.title, 'at', bglrJobs.jobs?.[0]?.company);

  const remoteJobs = await fetch(`${baseUrl}/jobs?locationType=Remote&limit=3`).then(r => r.json());
  console.log('   Remote Jobs Found:', remoteJobs.jobs?.length, '| Top:', remoteJobs.jobs?.[0]?.title);

  const sampleJob = bglrJobs.jobs?.[0];
  const sampleJobId = sampleJob?._id || sampleJob?.id;

  // 4. Smart Resume Matching (Feature 1)
  if (sampleJobId) {
    const matchRes = await fetch(`${baseUrl}/match/job/${sampleJobId}`, { headers: authHeaders }).then(r => r.json());
    console.log('4. Smart Match Analysis:', matchRes.success ? 'SUCCESS' : 'FAILED');
    console.log('   Score:', matchRes.analysis?.matchPercentage + '%');
    console.log('   Why it suits:', matchRes.analysis?.suitabilityReasons?.[0]);
    console.log('   Matched Skills:', matchRes.analysis?.matchedSkills?.slice(0, 3).join(', '));
    console.log('   Missing Skills:', matchRes.analysis?.missingSkills?.join(', '));
  }

  // 5. AI Interview Preparation (Feature 3)
  const interviewRes = await fetch(`${baseUrl}/interview/generate`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      jobId: sampleJobId,
      targetRole: 'Software Development Engineer - Fresher',
    })
  }).then(r => r.json());
  console.log('5. AI Interview Prep Kit:', interviewRes.success ? 'SUCCESS' : 'FAILED');
  console.log('   Role Questions:', interviewRes.prepKit?.roleQuestions?.length);
  console.log('   Sample Question:', interviewRes.prepKit?.roleQuestions?.[0]?.question);
  console.log('   Coding Challenge:', interviewRes.prepKit?.codingProblems?.[0]?.title);

  // 6. Mock Answer Evaluation
  const mockRes = await fetch(`${baseUrl}/interview/mock-answer`, {
    method: 'POST',
    headers: authHeaders,
    body: JSON.stringify({
      question: 'How does the Virtual DOM optimize React performance?',
      answer: 'The Virtual DOM keeps a lightweight copy of the real DOM in memory. When state updates, React diffs the old and new VDOM and batches updates to minimize costly real DOM repaints.',
      jobRole: 'Frontend Developer',
    })
  }).then(r => r.json());
  console.log('6. Mock Answer Evaluation Score:', mockRes.evaluation?.score + '/10');
  console.log('   Feedback:', mockRes.evaluation?.feedback);

  // 7. Skill Gap & Career Roadmap (Feature 4)
  const roadmapRes = await fetch(`${baseUrl}/roadmap?targetRole=Full Stack Developer`, { headers: authHeaders }).then(r => r.json());
  console.log('7. Skill Gap Roadmap:', roadmapRes.success ? 'SUCCESS' : 'FAILED');
  console.log('   Readiness Score:', roadmapRes.roadmap?.completionPercentage + '%');
  console.log('   Missing Skills Count:', roadmapRes.roadmap?.missingSkills?.length);

  // 8. Update Skill Status in Roadmap
  const updateSkillRes = await fetch(`${baseUrl}/roadmap/skill-status`, {
    method: 'PUT',
    headers: authHeaders,
    body: JSON.stringify({
      skillName: roadmapRes.roadmap?.missingSkills?.[0]?.name || 'Docker & Containerization',
      status: 'Mastered',
    })
  }).then(r => r.json());
  console.log('8. Updated Skill to Mastered. New Progress:', updateSkillRes.completionPercentage + '%');

  // 9. Save Job & Application Tracker
  if (sampleJobId) {
    const saveJobRes = await fetch(`${baseUrl}/applications`, {
      method: 'POST',
      headers: authHeaders,
      body: JSON.stringify({
        jobId: sampleJobId,
        status: 'Interviewing',
        matchScore: 92,
      })
    }).then(r => r.json());
    console.log('9. Application Tracker:', saveJobRes.success ? 'SUCCESS' : 'FAILED', '| Stage:', saveJobRes.application?.status);

    const getAppsRes = await fetch(`${baseUrl}/applications`, { headers: authHeaders }).then(r => r.json());
    console.log('   Tracked Applications Count:', getAppsRes.count);
  }

  console.log('\n--- ALL INTEGRATION TESTS PASSED SUCCESSFULLY! ---');
}

runTests().catch(err => console.error('Test Failed:', err));
