test('frontend sanity', () => {
  const div = document.createElement('div');
  div.id = 'root';
  expect(div.id).toBe('root');
});

