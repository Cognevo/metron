
/**
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { PcapFiltersComponent } from './pcap-filters.component';
import { FormsModule } from '../../../../node_modules/@angular/forms';
import { Component, Input, Output, EventEmitter, DebugElement, SimpleChange } from '@angular/core';
import { PcapRequest } from '../model/pcap.request';

@Component({
  selector: 'app-date-picker',
  template: '<input type="text" [(value)]="date">',
})
class FakeDatePickerComponent {
  @Input() date: string;
  @Output() dateChange = new EventEmitter<string>();
}

describe('PcapFiltersComponent', () => {
  let component: PcapFiltersComponent;
  let fixture: ComponentFixture<PcapFiltersComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        FormsModule
      ],
      declarations: [
        FakeDatePickerComponent,
        PcapFiltersComponent,
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PcapFiltersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('From date should be bound to the component', () => {
    let input = fixture.debugElement.query(By.css('#startTime'));
    const dateString = '2020-11-11 11:11:11';
    input.componentInstance.dateChange.emit(dateString);
    fixture.detectChanges();

    expect(component.startTimeStr).toBe(dateString);
  });

  it('To date should be bound to the component', () => {
    let input = fixture.debugElement.query(By.css('#endTime'));
    const dateString = '2030-11-11 11:11:11';
    input.componentInstance.dateChange.emit(dateString);
    fixture.detectChanges();

    expect(component.endTimeStr).toBe(dateString);
  });

  it('IP Source Address should be bound to the model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="ipSrcAddr"]');
    input.value = '192.168.0.1';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.model.ipSrcAddr).toBe('192.168.0.1');
  });

  it('IP Source Port should be bound to the property', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="ipSrcPort"]');
    input.value = '9345';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.ipSrcPort).toBe('9345');
  });

  it('IP Source Port should be converted to number on submit', () => {
    component.ipSrcPort = '42';
    component.search.emit = (model: PcapRequest) => {
      expect(model.ipSrcPort).toBe(42);
    };
    component.onSubmit();
  });

  it('IP Dest Address should be bound to the model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="ipDstAddr"]');
    input.value = '256.0.0.7';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.model.ipDstAddr).toBe('256.0.0.7');
  });

  it('IP Dest Port should be bound to the property', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="ipDstPort"]');
    input.value = '8989';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.ipDstPort).toBe('8989');
  });

  it('IP Dest Port should be converted to number on submit', () => {
    component.ipDstPort = '42';
    component.search.emit = (model: PcapRequest) => {
      expect(model.ipDstPort).toBe(42);
    };
    component.onSubmit();
  });

  it('Protocol should be bound to the model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="protocol"]');
    input.value = 'TCP';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.model.protocol).toBe('TCP');
  });

  it('Include Reverse Traffic should be bound to the model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="includeReverse"]');
    input.click();
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.model.includeReverse).toBe(true);
  });

  it('Text filter should be bound to the model', () => {
    let input: HTMLInputElement = fixture.nativeElement.querySelector('[name="protocol"]');
    input.value = 'TestStringFilter';
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(component.model.protocol).toBe('TestStringFilter');
  });

  it('From date should be converted to timestamp on submit', () => {
    component.startTimeStr = '2220-12-12 12:12:12';
    component.search.emit = (model: PcapRequest) => {
      expect(model.startTimeMs).toBe(new Date(component.startTimeStr).getTime());
    };
    component.onSubmit();
  });

  it('To date should be converted to timestamp on submit', () => {
    component.endTimeStr = '2320-03-13 13:13:13';
    component.search.emit = (model: PcapRequest) => {
      expect(model.endTimeMs).toBe(new Date(component.endTimeStr).getTime());
    };
    component.onSubmit();
  });

  it('Port fields should be missing by default', () => {
    component.search.emit = (model: PcapRequest) => {
      expect(model.ipSrcPort).toBeFalsy();
      expect(model.ipDstPort).toBeFalsy();
    };
    component.onSubmit();
  });

  it('Port fields should be removed from request when set to empty', () => {
    component.model.ipSrcPort = 44;
    component.model.ipDstPort = 44;
    component.ipSrcPort = '';
    component.ipDstPort = '';

    component.search.emit = (model: PcapRequest) => {
      expect(model.ipSrcPort).toBeFalsy();
      expect(model.ipDstPort).toBeFalsy();
    };
    component.onSubmit();
  });

  it('Filter should have an output called search', () => {
    component.search.subscribe((filterModel) => {
      expect(filterModel).toBeDefined();
    });
    component.onSubmit();
  });

  it('Filter should emit search event on submit', () => {
    spyOn(component.search, 'emit');
    component.onSubmit();
    expect(component.search.emit).toHaveBeenCalled();
  });

  it('Search event should contains the filter model', () => {
    spyOn(component.search, 'emit');
    component.onSubmit();
    expect(component.search.emit).toHaveBeenCalledWith(component.model);
  });

  it('Filter model structure aka PcapRequest', () => {
    expect(fixture.componentInstance.model.hasOwnProperty('startTimeMs')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('endTimeMs')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('ipSrcAddr')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('ipSrcPort')).toBeFalsy();
    expect(fixture.componentInstance.model.hasOwnProperty('ipDstAddr')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('ipDstPort')).toBeFalsy();
    expect(fixture.componentInstance.model.hasOwnProperty('protocol')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('packetFilter')).toBeTruthy();
    expect(fixture.componentInstance.model.hasOwnProperty('includeReverse')).toBeTruthy();
  });

  it('should update request on changes', () => {

    let startTimeStr = '2220-12-12 12:12:12';
    let endTimeStr = '2320-03-13 13:13:13';

    let newModel = {
      startTimeMs: new Date(startTimeStr).getTime(),
      endTimeMs: new Date(endTimeStr).getTime(),
      ipSrcPort: 9345,
      ipDstPort: 8989
    };
    component.model.startTimeMs = new Date(startTimeStr).getTime();
    component.model.endTimeMs = new Date(endTimeStr).getTime();

    component.ngOnChanges({
      model: new SimpleChange(null, newModel, false)
    });

    expect(component.startTimeStr).toBe(startTimeStr);
    expect(component.endTimeStr).toBe(endTimeStr);
    expect(component.ipSrcPort).toBe('9345');
    expect(component.ipDstPort).toBe('8989');
  });

  it('should update request on changes with missing port filters', () => {

    let startTimeStr = '2220-12-12 12:12:12';
    let endTimeStr = '2320-03-13 13:13:13';

    let newModel = {
      startTimeMs: new Date(startTimeStr).getTime(),
      endTimeMs: new Date(endTimeStr).getTime()
    };
    component.model.startTimeMs = new Date(startTimeStr).getTime();
    component.model.endTimeMs = new Date(endTimeStr).getTime();

    component.ngOnChanges({
      model: new SimpleChange(null, newModel, false)
    });

    expect(component.startTimeStr).toBe(startTimeStr);
    expect(component.endTimeStr).toBe(endTimeStr);
    expect(component.ipSrcPort).toBe('');
    expect(component.ipDstPort).toBe('');
  });

  describe('Filter validation', () => {

    function setup() {
      component.queryRunning = false;
      fixture.detectChanges();
    }

    function getFieldWithSubmit(fieldId: string): { field: DebugElement, submit: DebugElement } {
      const field = fixture.debugElement.query(By.css('[data-qe-id="' + fieldId  + '"]'));
      const submit = fixture.debugElement.query(By.css('[data-qe-id="submit-button"]'));
      return {
        field,
        submit
      };
    }

    function setFieldValue(field: DebugElement, value: any) {
      field.nativeElement.value = value;
      field.nativeElement.dispatchEvent(new Event('input'));
      fixture.detectChanges();
    }

    function isSubmitDisabled(submit: DebugElement): boolean {
      return submit.classes['disabled'] && submit.nativeElement.disabled;
    }

    function isFieldInvalid(field: DebugElement): boolean {
      return field.classes['ng-invalid'];
    }

    function tearDown(field: DebugElement) {
      setFieldValue(field, '');
    };

    beforeEach(setup);

    it('should disable the form if the ip source port is invalid', () => {
      const invalidValues = [
        '-42',
        '-1',
        'foobar',
        '.',
        '-',
        '+',
        'e',
        'E',
        '3.14',
        '123456',
        '65536',
        '99999',
        '2352363474576',
        '1e3',
      ];

      invalidValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-src-port');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(true, 'the field should be invalid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(true, 'the submit button should be disabled with ' + value);
        tearDown(els.field);
      });
    });

    it('should keep the form enabled if the ip source port is valid', () => {
      const validValues = [
        '8080',
        '1024',
        '3000',
        '1',
        '0',
        '12345',
        '65535',
      ];

      validValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-src-port');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled with ' + value);
        tearDown(els.field);
      });
    });

    it('should disable the form if the ip destination port is invalid', () => {
      const invalidValues = [
        '-42',
        '-1',
        'foobar',
        '.',
        '-',
        '+',
        'e',
        'E',
        '3.14',
        '123456',
        '65536',
        '99999',
        '2352363474576',
        '1e3',
      ];

      invalidValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-dest-port');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(true, 'the field should be invalid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(true, 'the submit button should be disabled with ' + value);
        tearDown(els.field);
      });
    });

    it('should keep the form enabled if the ip destination port is valid', () => {
      const validValues = [
        '8080',
        '1024',
        '3000',
        '1',
        '0',
        '12345',
        '65535',
      ];

      validValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-dest-port');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled with ' + value);
        tearDown(els.field);
      });
    });


    it('should disable the form if the ip source field is invalid', () => {
      const invalidValues = [
        'tst',
        0o0,
        0,
        '111.111.111',
        '222.222.222.222.222',
        '333.333.333.333',
      ];

      invalidValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-src-addr');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(true, 'the field should be invalid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(true, 'the submit button should be disabled with ' + value);
        tearDown(els.field);
      });
    });

    it('should keep the form enabled if the ip source field is valid', () => {
      const validValues = [
        '0.0.0.0',
        '222.222.222.222',
        '255.255.255.255',
      ];

      validValues.forEach((value) => {
        const els = getFieldWithSubmit('ip-src-addr');
        expect(isFieldInvalid(els.field)).toBe(false, 'the field should be valid without ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled without ' + value);

        setFieldValue(els.field, value);

        expect(isFieldInvalid(els.field)).toBe(false, 'tthe field should be valid with ' + value);
        expect(isSubmitDisabled(els.submit)).toBe(false, 'the submit button should be enabled with ' + value);
        tearDown(els.field);
      });
    });

  });
});
