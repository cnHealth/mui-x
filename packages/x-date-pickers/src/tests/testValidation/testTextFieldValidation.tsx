import * as React from 'react';
import { expect } from 'chai';
import { spy } from 'sinon';
import { screen } from '@mui/monorepo/test/utils';
import TextField from '@mui/material/TextField';
import { adapterToUse } from 'test/utils/pickers-utils';

function testTextFieldValidation(ElementToTest, propsToTest, getOptions) {
  describe('validation in textfield:', () => {
    const { isLegacyPicker } = getOptions();

    const defaultProps = isLegacyPicker
      ? {
          onChange: () => {},
          renderInput: (params) => <TextField {...params} />,
          reduceAnimations: true,
          showToolbar: false,
        }
      : {};

    if (propsToTest.includes('shouldDisableDate')) {
      it('should apply shouldDisableDate', function test() {
        const { render, withDate } = getOptions();

        if (!isLegacyPicker && !withDate) {
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2018, 2, 12))}
            shouldDisableDate={(date) =>
              adapterToUse.isAfter(date, adapterToUse.date(new Date(2018, 2, 10)))
            }
          />,
        );

        if (withDate) {
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
          expect(onErrorMock.callCount).to.equal(1);
          expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableDate');

          setProps({ value: adapterToUse.date(new Date(2018, 2, 9)) });

          expect(onErrorMock.callCount).to.equal(2);
          expect(onErrorMock.lastCall.args[0]).to.equal(null);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
          expect(onErrorMock.callCount).to.equal(0);
        }
      });
    }

    if (propsToTest.includes('shouldDisableYear')) {
      it('should apply shouldDisableYear', function test() {
        const { render, withDate } = getOptions();
        if (!withDate) {
          // Early return to remove when DateTimePickers will support those props
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2018, 2, 12))}
            shouldDisableYear={(date) => adapterToUse.getYear(date) === 2018}
          />,
        );

        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableYear');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date(new Date(2019, 2, 9)) });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      });
    }

    if (propsToTest.includes('shouldDisableMonth')) {
      it('should apply shouldDisableMonth', function test() {
        const { render, withDate } = getOptions();
        if (!withDate) {
          // Early return to remove when DateTimePickers will support those props
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            shouldDisableMonth={(date) => adapterToUse.getMonth(date) === 2}
            value={adapterToUse.date(new Date(2018, 2, 12))}
          />,
        );

        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('shouldDisableMonth');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date(new Date(2019, 2, 9)) });

        expect(onErrorMock.callCount).to.equal(1);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: adapterToUse.date(new Date(2018, 3, 9)) });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      });
    }

    if (propsToTest.includes('disablePast')) {
      it('should apply disablePast', function test() {
        const { render, withDate } = getOptions();
        if (!withDate) {
          return;
        }

        let now;
        function WithFakeTimer(props) {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <WithFakeTimer {...defaultProps} disablePast onError={onErrorMock} />,
        );

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        setProps({ value: yesterday });

        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('disablePast');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: tomorrow });

        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      });
    }

    if (propsToTest.includes('disableFuture')) {
      it('should apply disableFuture', function test() {
        const { render, withDate } = getOptions();
        if (!withDate) {
          return;
        }

        let now;
        function WithFakeTimer(props) {
          now = adapterToUse.date(new Date());
          return <ElementToTest value={now} {...props} />;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <WithFakeTimer {...defaultProps} disableFuture onError={onErrorMock} />,
        );

        const tomorrow = adapterToUse.addDays(now, 1);
        const yesterday = adapterToUse.addDays(now, -1);

        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        setProps({ value: tomorrow });
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('disableFuture');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        setProps({ value: yesterday });
        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      });
    }

    if (propsToTest.includes('minDate')) {
      it('should apply minDate', function test() {
        const { render, withDate } = getOptions();

        if (!isLegacyPicker && !withDate) {
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2019, 5, 1))}
            minDate={adapterToUse.date(new Date(2019, 5, 15))}
          />,
        );

        if (withDate) {
          expect(onErrorMock.callCount).to.equal(1);
          expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date(new Date(2019, 5, 20)) });

          expect(onErrorMock.callCount).to.equal(2);
          expect(onErrorMock.lastCall.args[0]).to.equal(null);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock.callCount).to.equal(0);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        }
      });
    }

    if (propsToTest.includes('maxDate')) {
      it('should apply maxDate', function test() {
        const { render, withDate } = getOptions();

        if (!isLegacyPicker && !withDate) {
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2019, 5, 25))}
            maxDate={adapterToUse.date(new Date(2019, 5, 15))}
          />,
        );

        if (withDate) {
          expect(onErrorMock.callCount).to.equal(1);
          expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date(new Date(2019, 5, 10)) });

          expect(onErrorMock.callCount).to.equal(2);
          expect(onErrorMock.lastCall.args[0]).to.equal(null);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock.callCount).to.equal(0);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        }
      });
    }
    if (propsToTest.includes('minTime')) {
      it('should apply minTime', function test() {
        const { render, withTime } = getOptions();

        if (!isLegacyPicker && !withTime) {
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2019, 5, 15, 10, 15))}
            minTime={adapterToUse.date(new Date(2010, 0, 1, 12, 0))}
          />,
        );
        if (withTime) {
          expect(onErrorMock.callCount).to.equal(1);
          expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

          setProps({ value: adapterToUse.date(new Date(2019, 5, 15, 13, 10)) });

          expect(onErrorMock.callCount).to.equal(2);
          expect(onErrorMock.lastCall.args[0]).to.equal(null);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        } else {
          expect(onErrorMock.callCount).to.equal(0);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        }
      });
    }
    if (propsToTest.includes('maxTime')) {
      it('should apply maxTime', function test() {
        const { render, withTime } = getOptions();

        if (!isLegacyPicker && !withTime) {
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            maxTime={adapterToUse.date(new Date(2010, 0, 1, 12, 0))}
            value={adapterToUse.date(new Date(2019, 5, 15, 10, 15))}
          />,
        );
        if (withTime) {
          expect(onErrorMock.callCount).to.equal(0);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

          setProps({ value: adapterToUse.date(new Date(2019, 5, 15, 13, 10)) });

          expect(onErrorMock.callCount).to.equal(1);
          expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
        } else {
          expect(onErrorMock.callCount).to.equal(0);
          expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
        }
      });
    }

    if (propsToTest.includes('maxDateTime')) {
      it('should apply maxDateTime', function test() {
        const { render, withTime, withDate } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2019, 5, 15, 13, 15))}
            maxDateTime={adapterToUse.date(new Date(2019, 5, 15, 12, 0))}
          />,
        );
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('maxTime');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        // Test 5 minutes before
        setProps({ value: adapterToUse.date(new Date(2019, 5, 15, 11, 55)) });
        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        // Test 1 day before
        setProps({ value: adapterToUse.date(new Date(2019, 5, 14, 20, 10)) });
        expect(onErrorMock.callCount).to.equal(2);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        // Test 1 day after
        setProps({ value: adapterToUse.date(new Date(2019, 5, 16, 10, 0)) });
        expect(onErrorMock.callCount).to.equal(3);
        expect(onErrorMock.lastCall.args[0]).to.equal('maxDate');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');
      });
    }
    if (propsToTest.includes('minDateTime')) {
      it('should apply minDateTime', function test() {
        const { render, withTime, withDate } = getOptions();
        if (!withDate || !withTime) {
          // prop only available on DateTime pickers
          return;
        }

        const onErrorMock = spy();
        const { setProps } = render(
          <ElementToTest
            {...defaultProps}
            onError={onErrorMock}
            value={adapterToUse.date(new Date(2019, 5, 15, 13, 15))}
            minDateTime={adapterToUse.date(new Date(2019, 5, 15, 12, 0))}
          />,
        );
        expect(onErrorMock.callCount).to.equal(0);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');

        // Test 5 minutes before (invalid)
        setProps({ value: adapterToUse.date(new Date(2019, 5, 15, 11, 55)) });
        expect(onErrorMock.callCount).to.equal(1);
        expect(onErrorMock.lastCall.args[0]).to.equal('minTime');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        // Test 1 day before (invalid)
        setProps({ value: adapterToUse.date(new Date(2019, 5, 14, 20, 10)) });
        expect(onErrorMock.callCount).to.equal(2);
        expect(onErrorMock.lastCall.args[0]).to.equal('minDate');
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'true');

        // Test 1 day after
        setProps({ value: adapterToUse.date(new Date(2019, 5, 16, 10, 0)) });
        expect(onErrorMock.callCount).to.equal(3);
        expect(onErrorMock.lastCall.args[0]).to.equal(null);
        expect(screen.getByRole('textbox')).to.have.attribute('aria-invalid', 'false');
      });
    }
  });
}

export default testTextFieldValidation;