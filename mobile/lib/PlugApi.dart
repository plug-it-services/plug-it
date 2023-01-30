
import 'package:flutter/foundation.dart';
import 'package:json_annotation/json_annotation.dart';
import 'package:mobile/models/Event.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/service/Service.dart';

import 'package:dio/dio.dart';
import 'package:dio_cookie_manager/dio_cookie_manager.dart';
import 'package:cookie_jar/cookie_jar.dart';
import 'package:uuid/uuid.dart';


class PlugError {
  var error;
  int statusCode;
  String statusMessage;

  PlugError({required this.error, required this.statusCode, required this.statusMessage});
}

class PlugApi {
  static String? token;
  static String? sessionToken = const Uuid().v4();
  static const String devApiUrl = "https://api-area-dev.alexandrejublot.com";
  static const String apiUrl = (kReleaseMode) ? "https://api-area.alexandrejublot.com" : devApiUrl;
  static const String assetsUrl = (kReleaseMode) ? "https://area.alexandrejublot.com" : "https://area-dev.alexandrejublot.com";
  static var error;
  static var cookies = CookieJar();
  static var dio = Dio();

  static void init() {
    dio.interceptors.add(CookieManager(cookies));
    dio.interceptors.add(InterceptorsWrapper(onRequest: (options, handler) async {
      options.extra["withCredentials"] = true;
      return handler.next(options);
    }));
  }

  static Options getHeaders() {
    // return cookies and headers with access token
    return Options(
        headers: {
          "crsf-token": sessionToken ?? "",
          //"Cookie": "access_token=${token ?? ""}",
        },
        extra: {

        },
        contentType: "application/json"
    );
  }

  static void handleError(Response result) {
    if (result.statusCode != 200) {
      throw PlugError(error: null, statusCode: result.statusCode!, statusMessage: result.statusMessage!);
    }
    if (result.data == null) {
      throw PlugError(error: error, statusCode: 500, statusMessage: "Error occurred but not raised by server, no data received.");
    }
  }

  static bool handleResponseCheck(Response result, {int excpeted = 200}) {
    if (result.statusCode != excpeted) {
      throw PlugError(error: null, statusCode: result.statusCode!, statusMessage: result.statusMessage!);
    }
    return true;
  }

  static Future<List<Service>?> getServices() async {
      List<Service>? services;

      Response result = await dio.get("$apiUrl/services", options: getHeaders());
      handleError(result);
      services = [];
      for (var json in result.data!) {
        services.add(Service.fromJson(json));
      }
      return services;
  }

  static Future<String?> OAuth2(String serviceName) async {
    //TODO: OAuth2
  }

  static Future<String?> OAuth2Callback(String serviceName) async {
    //TODO: OAuth2Callback

  }

  static Future<String?> OAuthApiKey(String serviceName, String apiKey) async {
    //TODO: OAuth2ApiKey
  }

  static Future<String?> OAuthCredentials(String serviceName, String id, String secret) async {
    //TODO: OAuth2Crendentials
  }

  static Future<bool> disconnectService(String serviceName) async {
    Response result = await dio.post("$apiUrl/service/$serviceName/disconnect", options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<List<Event>?> getServiceEvents(String serviceName) async {
    List<Event>? events;

    Response result = await dio.get("$apiUrl/service/$serviceName/events", options: getHeaders());
    handleError(result);
    events = [];
    for (var json in result.data!) {
      events.add(Event.fromJson(json));
    }
    return events;
  }

  static Future<List<Event>?> getServiceActions(String serviceName) async {
    List<Event>? events;

    Response result = await dio.get("$apiUrl/service/$serviceName/actions", options: getHeaders());
    handleError(result);
    events = [];
    for (var json in result.data!) {
      events.add(Event.fromJson(json));
    }
    return events;
  }

  static Future<List<Plug>?> getPlugs() async {
    List<Plug>? plugs;

    Response result = await dio.get("$apiUrl/plugs", options: getHeaders());
    handleError(result);
    plugs = [];
    for (var json in result.data!) {
      plugs.add(Plug.fromJson(json));
    }
    return plugs;
  }

  static Future<bool> createPlug(PlugDetails plug) async {
    Response result = await dio.post("$apiUrl/plugs", data:plug, options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<PlugDetails?> getPlug(String id) async {
    Response result = await dio.get("$apiUrl/plugs/$id", options: getHeaders());
    handleError(result);
    return PlugDetails.fromJson(result.data);
  }

  static Future<bool> deletePlug(String id) async {
    Response result = await dio.delete("$apiUrl/plugs/$id", options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<bool> editPlug(PlugDetails plug) async {
    Response result = await dio.put("$apiUrl/plugs/${plug.id}", data: plug, options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<bool> enablePlug(String id, bool enabled) async {
    Response result = await dio.put("$apiUrl/plugs/$id/enabled", queryParameters: {'enabled': enabled.toString().toLowerCase()}, options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<bool> login(String email, String password) async {
    var options = getHeaders();
    Response result = await dio.post("$apiUrl/auth/login", data:{"email": email, "password": password}, options: options);
    token = result.headers.map['Set-Cookie']?[0];
    return handleResponseCheck(result);
  }

  static Future<bool> register(String firstName, String lastName, String email, String password) async {
    Response result = await dio.post("$apiUrl/auth/login", data:{"firstName":firstName, "lastName":lastName, "email": email, "password": password}, options: getHeaders());
    return handleResponseCheck(result);
  }

  static Future<bool> ssoLogin(String serviceName, String code) async {
    Response result = await dio.post("$apiUrl/auth/$serviceName/login", data:{"code":code}, options: getHeaders());
    token = result.headers.map['Set-Cookie']?[0];
    return handleResponseCheck(result);
  }
}