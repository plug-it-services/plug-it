
import 'package:mobile/models/Event.dart';
import 'package:mobile/models/plug/Plug.dart';
import 'package:mobile/models/plug/PlugDetails.dart';
import 'package:mobile/models/service/Service.dart';

import 'package:dio/dio.dart';
import 'package:uuid/uuid.dart';


class PlugApi {
  static String? token;
  static String? sessionToken = const Uuid().v4();
  static const String apiUrl = "https://plug-it.com";
  static const String devApiUrl = "https://localhost.com/";
  static var error;
  static var dio = Dio();

  static dynamic getHeaders() {
    return Options(
        headers: {
          "crsf_token": sessionToken!,
          "access_token": token!
        },
        contentType: "application/json"
    );
  }

  static Future<List<Service>?> getServices() async {
    try {
      Response<List<Service>> result = await dio.get<List<Service>>("$apiUrl/services", options: getHeaders());
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
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
    try {
      Response result = await dio.post("$apiUrl/service/$serviceName/disconnect", options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  static Future<List<Event>?> getServiceEvents(String serviceName) async {
    try {
      Response<List<Event>> result = await dio.get<List<Event>>("$apiUrl/service/$serviceName/events", options: getHeaders());
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  static Future<List<Event>?> getServiceActions(String serviceName) async {
    try {
      Response<List<Event>> result = await dio.get<List<Event>>("$apiUrl/service/$serviceName/actions", options: getHeaders());
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }

  }

  static Future<List<Plug>?> getPlugs() async {
    try {
      Response<List<Plug>> result = await dio.get<List<Plug>>("$apiUrl/plugs", options: getHeaders());
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  static Future<bool> createPlug(PlugDetails plug) async {
    try {
      Response result = await dio.post("$apiUrl/plugs", data:plug, options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  static Future<PlugDetails?> getPlug(String id) async {
    try {
      Response<PlugDetails> result = await dio.get<PlugDetails>("$apiUrl/plugs/$id", options: getHeaders());
      return result.data;
    } catch (error) {
      PlugApi.error = error;
      return null;
    }
  }

  static Future<bool> deletePlug(String id) async {
    try {
      Response result = await dio.delete("$apiUrl/plugs/$id", options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  static Future<bool> editPlug(PlugDetails plug) async {
    try {
      Response result = await dio.put("$apiUrl/plugs/${plug.id}", data: plug, options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  static Future<bool> enablePlug(String id, bool enabled) async {
    try {
      Response result = await dio.put("$apiUrl/plugs/$id/enabled", queryParameters: {'enabled': enabled.toString().toLowerCase()}, options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }

  }

  static Future<bool> login(String email, String password) async {
    try {
      Response result = await dio.post("$apiUrl/auth/login", data:{"email": email, "password": password}, options: getHeaders());
      token = result.headers.map['Set-Cookie']?[0];
      return result.statusCode == 200 && token != null;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }

  static Future<bool> register(String firstName, String lastName, String email, String password) async {
    try {
      Response result = await dio.post("$apiUrl/auth/login", data:{"firstName":firstName, "lastName":lastName, "email": email, "password": password}, options: getHeaders());
      return result.statusCode == 200;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }

  }

  static Future<bool> ssoLogin(String serviceName, String code) async {
    try {
      Response result = await dio.post("$apiUrl/auth/$serviceName/login", data:{"code":code}, options: getHeaders());
      token = result.headers.map['Set-Cookie']?[0];
      return result.statusCode == 200 && token != null;
    } catch (error) {
      PlugApi.error = error;
      return false;
    }
  }
}