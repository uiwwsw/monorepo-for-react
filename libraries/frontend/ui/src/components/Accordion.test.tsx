import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Accordion from './Accordion'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Accordion component', () => {
  it('should render the title', () => {
    render(<Accordion title="Test Title">Test Content</Accordion>);
    const titleInput = screen.getByRole('button', { name: /Test Title/i });
    expect(titleInput).toBeInTheDocument();
  });

  it('should initially hide the content', async () => {
    render(<Accordion title="Test Title">Test Content</Accordion>);
    const contentDiv = await screen.queryByRole('article');
    expect(contentDiv).toHaveStyle({ height: '0px' });
    expect(contentDiv).toHaveTextContent('Test Content');
  });

  it('should toggle content height when clicked', async () => {
    render(
      <Accordion title="Test Title">
        <div>Test Contentd awdawdawd awdawdawddawdawawd awdawd</div>
      </Accordion>,
    );
    const titleInput = screen.getByRole('button', { name: /Test Title/i });
    const article = screen.getByRole('article');
    const contentinfo = screen.getByRole('contentinfo');
    expect(contentinfo?.dataset.active).toEqual('false');
    fireEvent.click(titleInput);
    expect(article).not.toHaveStyle({ height: '0px' });
    expect(contentinfo?.dataset.active).toEqual('true');

    fireEvent.click(titleInput);

    expect(article).toHaveStyle({ height: '0px' });
    expect(contentinfo?.dataset.active).toEqual('false');
  });
});
