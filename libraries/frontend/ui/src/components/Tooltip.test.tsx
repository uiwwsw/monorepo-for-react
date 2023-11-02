import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Tooltip from './Tooltip'; // 경로는 실제 경로에 맞게 변경해주세요

describe('Tooltip component', () => {
  it('should render tooltip content correctly', () => {
    render(<Tooltip>Sample Tooltip Text</Tooltip>);
    expect(screen.getByText('Sample Tooltip Text')).toBeInTheDocument();
  });

  it('should not display tooltip content when not hovered', () => {
    render(<Tooltip>Sample Tooltip Text</Tooltip>);
    const tooltipContent = screen.getByText('Sample Tooltip Text');
    expect(tooltipContent.dataset.smooth).toBe(undefined);
  });

  it('should display tooltip content on mouse enter and hide on mouse leave', () => {
    render(<Tooltip>Sample Tooltip Text</Tooltip>);
    const tooltipWrapper = screen.getByText('❓').parentElement;
    const tooltipContent = screen.getByText('Sample Tooltip Text');

    // Trigger mouse enter and check visibility
    fireEvent.mouseEnter(tooltipWrapper!);

    // Check the dataset directly
    expect(tooltipContent.dataset.smooth).toBe('SHOWING');

    // Trigger mouse leave and check visibility
    fireEvent.mouseLeave(tooltipWrapper!);

    // Check the dataset directly
    expect(tooltipContent.dataset.smooth).toBe('HIDING');
  });
});
