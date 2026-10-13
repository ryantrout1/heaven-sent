import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { addressOneLine, addressTwoLines, applyFacts, hoursSummary, hoursWords, mergeBusiness, readBusiness } from '../lib/business.mjs';

// The business facts file written by the Miloe engine (content/business.json), and the
// fallback the site keeps when the file is missing or broken.

const LINES = [
  { day: 'Monday', words: 'Closed' },
  { day: 'Tuesday', words: '10:00 AM to 5:00 PM' },
  { day: 'Wednesday', words: '10:00 AM to 5:00 PM' },
  { day: 'Thursday', words: '11:00 AM to 7:00 PM' },
  { day: 'Friday', words: '10:00 AM to 5:00 PM' },
  { day: 'Saturday', words: '10:00 AM to 5:00 PM' },
  { day: 'Sunday', words: 'Closed' },
];

test('falls back to what the site said when the file is missing or broken', () => {
  const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'hsb-'));
  assert.equal(readBusiness(dir).phone, '623-215-6084');
  fs.mkdirSync(path.join(dir, 'content'));
  fs.writeFileSync(path.join(dir, 'content', 'business.json'), 'not json');
  assert.equal(readBusiness(dir).bookingLink, 'https://www.vagaro.com/monroesalonandspa');
  assert.equal(hoursWords(readBusiness(dir)), 'By appointment');
});

test('takes each fact the file has and keeps the fallback where the file says null', () => {
  const b = mergeBusiness({ phone: '(623) 555-0100', instagramUrl: null, hoursLines: LINES });
  assert.equal(b.phone, '(623) 555-0100');
  assert.equal(b.instagramUrl, 'https://www.instagram.com/_heaven.sent.beauty_/');
  assert.equal(hoursSummary(b), 'Tuesday to Wednesday 10:00 AM to 5:00 PM; Thursday 11:00 AM to 7:00 PM; Friday to Saturday 10:00 AM to 5:00 PM; closed Monday and Sunday');
});

test("writes the address on one line and on two, without a zip's last four", () => {
  const b = mergeBusiness({ addressParts: { street: '111 Monroe Ave, Suite 101', city: 'Buckeye', region: 'AZ', postalCode: '85326-2707' } });
  assert.deepEqual(addressTwoLines(b), ['111 Monroe Ave, Suite 101', 'Buckeye, AZ 85326']);
  assert.equal(addressOneLine(b), '111 Monroe Ave, Suite 101, Buckeye, AZ 85326');
});

test('puts the facts into the site markup, escaped', () => {
  const b = mergeBusiness({ phone: '(623) 555-0100', bookingLink: 'https://book.example/a?b=1&c=2', addressParts: { street: '1 Main St', city: 'Buckeye', region: 'AZ', postalCode: '85326' } });
  const html = '<a href="https://www.vagaro.com/monroesalonandspa">Book</a><p>111 Monroe Ave STE 101<br/>Buckeye, AZ 85326</p><p>623-215-6084</p>';
  assert.equal(applyFacts(html, b), '<a href="https://book.example/a?b=1&amp;c=2">Book</a><p>1 Main St<br/>Buckeye, AZ 85326</p><p>(623) 555-0100</p>');
  assert.equal(applyFacts(html, mergeBusiness(null)), html);
});

test('the committed facts file reads, with all seven days of hours', () => {
  const b = readBusiness();
  assert.equal(b.name, 'Heaven Sent Beauty');
  assert.ok(Array.isArray(b.hoursLines) && b.hoursLines.length === 7);
});
