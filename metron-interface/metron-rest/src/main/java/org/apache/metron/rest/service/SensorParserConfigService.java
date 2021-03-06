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
package org.apache.metron.rest.service;

import org.apache.metron.common.configuration.SensorParserConfig;
import org.apache.metron.rest.RestException;
import org.apache.metron.rest.model.ParseMessageRequest;
import org.json.simple.JSONObject;

import java.util.List;
import java.util.Map;

public interface SensorParserConfigService {

  SensorParserConfig save(String name, SensorParserConfig sensorParserConfig) throws RestException;

  SensorParserConfig findOne(String name) throws RestException;

  Map<String, SensorParserConfig> getAll() throws RestException;

  List<String> getAllTypes() throws RestException;

  boolean delete(String name) throws RestException;

  Map<String, String> getAvailableParsers();

  Map<String, String> reloadAvailableParsers();

  JSONObject parseMessage(ParseMessageRequest parseMessageRequest) throws RestException;
}
